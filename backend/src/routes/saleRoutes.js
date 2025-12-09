const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const mongoose = require("mongoose");
function parseList(q) {
    if (!q && q !== 0) return undefined;
    if (Array.isArray(q)) return q;
    return String(q).split(",").map(s => s.trim()).filter(Boolean);
}
function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
router.get("/", async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            category,
            brand,
            region,
            gender,
            minAge,
            maxAge,
            tags,
            paymentMethod,
            startDate,
            endDate,
            minPrice,
            maxPrice,
            sort = ""
        } = req.query;

        page = Math.max(Number(page) || 1, 1);
        limit = Math.max(Number(limit) || 10, 1);
        const categoryList = parseList(category);
        const brandList = parseList(brand);
        const regionList = parseList(region);
        const genderList = parseList(gender);
        const tagsList = parseList(tags);
        const tagsRegexList = tagsList && tagsList.length
            ? tagsList.map(t => new RegExp('^' + escapeRegExp(t.trim()) + '$', 'i'))
            : undefined;
        const paymentMethodList = parseList(paymentMethod);



        const saleMatch = {};
        if (minPrice || maxPrice) {
            saleMatch.finalAmount = {};
            if (minPrice) saleMatch.finalAmount.$gte = Number(minPrice);
            if (maxPrice) saleMatch.finalAmount.$lte = Number(maxPrice);
        }
        if (startDate || endDate) {
            saleMatch.date = {};
            if (startDate) saleMatch.date.$gte = new Date(startDate);
            if (endDate) {
                const ed = new Date(endDate);
                if (ed.getHours() === 0 && ed.getMinutes() === 0 && ed.getSeconds() === 0) {
                    ed.setHours(23, 59, 59, 999);
                }
                saleMatch.date.$lte = ed;
            }
        }
        if (paymentMethodList) {
            saleMatch.paymentMethod = { $in: paymentMethodList };
        }


        const joinedMatch = {};

        if (categoryList) joinedMatch["product.category"] = { $in: categoryList };
        if (brandList) joinedMatch["product.brand"] = { $in: brandList };
        if (regionList) joinedMatch["customer.region"] = { $in: regionList };
        if (genderList) joinedMatch["customer.gender"] = { $in: genderList };
        if (tagsList) {
            joinedMatch.$or = joinedMatch.$or || [];
            if (tagsRegexList) {
                joinedMatch.$or.push({ tags: { $in: tagsRegexList } });
                joinedMatch.$or.push({ "product.tags": { $in: tagsRegexList } });
            } else {
                joinedMatch.$or.push({ tags: { $in: tagsList } });
                joinedMatch.$or.push({ "product.tags": { $in: tagsList } });
            }
        }
        if (minAge || maxAge) {
            joinedMatch["customer.age"] = {};
            if (minAge) joinedMatch["customer.age"].$gte = Number(minAge);
            if (maxAge) joinedMatch["customer.age"].$lte = Number(maxAge);
        }


        let joinedSearchMatch = null;

        if (search && String(search).trim()) {
            const s = String(search).trim();
            joinedSearchMatch = {
                $or: [
                    { "customer.name": { $regex: s, $options: "i" } },
                    { "customer.phone": { $regex: s, $options: "i" } },
                    { "product.name": { $regex: s, $options: "i" } }
                ]
            };
        }


        const sortOptions = {
            date_asc: { date: 1 },
            date_desc: { date: -1 },
            amount_asc: { finalAmount: 1 },
            amount_desc: { finalAmount: -1 },
            quantity_asc: { quantity: 1 },
            quantity_desc: { quantity: -1 },
            customer_asc: { "customer.name": 1, _id: 1 },
            customer_desc: { "customer.name": -1, _id: 1 }
        };

        const selectedSort = sort ? (sortOptions[sort] || null) : null;



        const pipeline = [];
        if (Object.keys(saleMatch).length)
            pipeline.push({ $match: saleMatch });

        pipeline.push(
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" }
        );
        if (Object.keys(joinedMatch).length)
            pipeline.push({ $match: joinedMatch });
        if (joinedSearchMatch)
            pipeline.push({ $match: joinedSearchMatch });
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    ...(selectedSort ? [{ $sort: selectedSort }] : []),
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    {
                        $project: {
                            transactionId: 1,
                            date: 1,
                            quantity: 1,
                            finalAmount: 1,
                            paymentMethod: 1,
                            tags: 1,
                            productName: "$product.name",
                            productCategory: "$product.category",
                            productBrand: "$product.brand",
                            productId: "$product.productId",
                            productTags: "$product.tags",
                            customerId: "$customer.customerId",
                            customerName: "$customer.name",
                            phoneNumber: "$customer.phone",
                            region: "$customer.region",
                            gender: "$customer.gender",
                            age: "$customer.age",
                        }
                    },
                    { $limit: limit }
                ]
            }
        });
        const result = await Sale.aggregate(pipeline).allowDiskUse(true).exec();

        const total = result[0]?.metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        return res.json({
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                applied: {
                    search: search || null,
                    category: categoryList || null,
                    brand: brandList || null,
                    region: regionList || null,
                    gender: genderList || null,
                    minAge: minAge ? Number(minAge) : null,
                    maxAge: maxAge ? Number(maxAge) : null,
                    tags: tagsList || null,
                    paymentMethod: paymentMethodList || null,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    minPrice: minPrice ? Number(minPrice) : null,
                    maxPrice: maxPrice ? Number(maxPrice) : null,
                    sort
                }
            },
            data: result[0]?.data || []
        });

    } catch (err) {
        console.error("GET /api/sales error:", err);
        res.status(500).json({ message: err.message });
    }
});
router.get("/stats", async (req, res) => {
    try {
        let {
            search = "",
            category,
            brand,
            region,
            gender,
            minAge,
            maxAge,
            tags,
            paymentMethod,
            startDate,
            endDate,
            minPrice,
            maxPrice,
            sort = ""
        } = req.query;
        const categoryList = parseList(category);
        const brandList = parseList(brand);
        const regionList = parseList(region);
        const genderList = parseList(gender);
        const tagsList = parseList(tags);
        const tagsRegexList = tagsList && tagsList.length
            ? tagsList.map(t => new RegExp('^' + escapeRegExp(t.trim()) + '$', 'i'))
            : undefined;
        const paymentMethodList = parseList(paymentMethod);

        const saleMatch = {};
        if (minPrice || maxPrice) {
            saleMatch.finalAmount = {};
            if (minPrice) saleMatch.finalAmount.$gte = Number(minPrice);
            if (maxPrice) saleMatch.finalAmount.$lte = Number(maxPrice);
        }
        if (startDate || endDate) {
            saleMatch.date = {};
            if (startDate) saleMatch.date.$gte = new Date(startDate);
            if (endDate) {
                const ed = new Date(endDate);
                if (ed.getHours() === 0 && ed.getMinutes() === 0 && ed.getSeconds() === 0) ed.setHours(23, 59, 59, 999);
                saleMatch.date.$lte = ed;
            }
        }
        if (paymentMethodList) saleMatch.paymentMethod = { $in: paymentMethodList };

        const joinedMatch = {};
        if (categoryList) joinedMatch["product.category"] = { $in: categoryList };
        if (brandList) joinedMatch["product.brand"] = { $in: brandList };
        if (regionList) joinedMatch["customer.region"] = { $in: regionList };
        if (genderList) joinedMatch["customer.gender"] = { $in: genderList };
        if (tagsList) {
            joinedMatch.$or = joinedMatch.$or || [];
            if (tagsRegexList) {
                joinedMatch.$or.push({ tags: { $in: tagsRegexList } });
                joinedMatch.$or.push({ "product.tags": { $in: tagsRegexList } });
            } else {
                joinedMatch.$or.push({ tags: { $in: tagsList } });
                joinedMatch.$or.push({ "product.tags": { $in: tagsList } });
            }
        }
        if (minAge || maxAge) {
            joinedMatch["customer.age"] = {};
            if (minAge) joinedMatch["customer.age"].$gte = Number(minAge);
            if (maxAge) joinedMatch["customer.age"].$lte = Number(maxAge);
        }

        let joinedSearchMatch = null;
        if (search && String(search).trim()) {
            const s = String(search).trim();
            joinedSearchMatch = {
                $or: [
                    { "customer.name": { $regex: s, $options: "i" } },
                    { "customer.phone": { $regex: s, $options: "i" } },
                    { "product.name": { $regex: s, $options: "i" } }
                ]
            };
        }

        const pipeline = [];
        if (Object.keys(saleMatch).length) pipeline.push({ $match: saleMatch });

        pipeline.push(
            { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
            { $unwind: "$product" },
            { $lookup: { from: "customers", localField: "customer", foreignField: "_id", as: "customer" } },
            { $unwind: "$customer" }
        );

        if (Object.keys(joinedMatch).length) pipeline.push({ $match: joinedMatch });
        if (joinedSearchMatch) pipeline.push({ $match: joinedSearchMatch });
        pipeline.push({
            $group: {
                _id: null,
                totalUnits: { $sum: { $ifNull: ["$quantity", 0] } },
                totalRevenue: { $sum: { $ifNull: ["$finalAmount", 0] } },
                totalDiscount: { $sum: { $subtract: [{ $ifNull: ["$totalAmount", 0] }, { $ifNull: ["$finalAmount", 0] }] } }
            }
        });

        const resAgg = await Sale.aggregate(pipeline).allowDiskUse(true).exec();
        const row = resAgg[0] || { totalUnits: 0, totalRevenue: 0, totalDiscount: 0 };
        return res.json({ stats: { totalUnits: row.totalUnits || 0, totalRevenue: row.totalRevenue || 0, totalDiscount: row.totalDiscount || 0 } });

    } catch (err) {
        console.error("GET /api/sales/stats error:", err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
