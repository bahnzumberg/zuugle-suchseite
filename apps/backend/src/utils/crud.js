import knex from '../knex';
import moment from "moment";

export const getAll = async (table, where, pagination = {}, preFunction, postFunction, rightJoin = null, timeRange = null, whereNotNull = null, whereRaw = null) => {
    let page = pagination.page < 1 ? 0 : (pagination.page - 1);
    let page_size = pagination.page_size;
    let limit = !!pagination.ignore_limit ? 10000 : 25;
    let offset = 0;
    let order_id = 'id';
    let order_desc = true;

    //pagination
    if (page !== undefined && page_size !== undefined && !!!pagination.ignore_limit) {
        limit = page_size;
        offset = page * page_size;
    }

    if (pagination.order_id !== undefined && pagination.order_desc !== undefined) {
        order_id = pagination.order_id;
        order_desc = (pagination.order_desc == 'true' || pagination.order_desc == 1);
    }

    let whereStatusIn = null;
    if(!!!where.status){
        where[`${table}.status`] = 1;
    } else if(Array.isArray(where.status)){
        whereStatusIn = [...where.status];
        delete where.status;
    }

    let whereCommunityIdIn = null;

    if(!!where.community_id && Array.isArray(where.community_id)){
        whereCommunityIdIn = where.community_id;
        delete where.community_id;
    } else if(!!where.community_id){
        whereCommunityIdIn = [where.community_id];
        delete where.community_id;
    }

    let query = knex(table).select(`${table}.*`).where(where);
    let countQuery = knex.count(`${table}.id as total`).from(table).where(where);

    if(!!whereStatusIn && whereStatusIn.length > 0){
        query = query.whereIn(`${table}.status`, whereStatusIn);
        countQuery = countQuery.whereIn(`${table}.status`, whereStatusIn);
    }

    if(!!whereCommunityIdIn && whereCommunityIdIn.length > 0){
        query = query.whereIn(`${table}.community_id`, whereCommunityIdIn);
        countQuery = countQuery.whereIn(`${table}.community_id`, whereCommunityIdIn);
    }

    let dateColumn = `${table}.created_at`;
    if(!!timeRange && Object.keys(timeRange).length > 0){
        if(table === "diary"){
            dateColumn = "date";
        } else if(table === "user_activities" || table === "machine_activities"){
            dateColumn = "start_time";
        }
        query = query.whereBetween(dateColumn, [timeRange.from, timeRange.to]);
        countQuery = countQuery.whereBetween(dateColumn, [timeRange.from, timeRange.to]);
    }

    if(!!whereNotNull){
        query = query.whereNotNull(whereNotNull);
        countQuery = countQuery.whereNotNull(whereNotNull);
    }

    if(!!whereRaw){
        query = query.andWhereRaw(whereRaw);
        countQuery = countQuery.andWhereRaw(whereRaw);
    }

    try {
        if(!!rightJoin){
            query = query.rightJoin(rightJoin[0], rightJoin[1]);
            countQuery = countQuery.rightJoin(rightJoin[0], rightJoin[1]);
        }
    } catch(e){
        console.error(e);
    }

    // console.log('query: ', query.toQuery());

    let result = await query
        .limit(limit)
        .offset(offset)
        .orderBy(order_id,  order_desc ? "DESC" : "ASC");


    let toReturn = {
        data: result,
        total: (await countQuery)[0].total
    };

    if(!!postFunction){
        toReturn = await postFunction(toReturn);
    }

    return toReturn;
}

export const getOne = async (id, table, preFunction, postFunction, throwError = false) => {
    let entity = await knex(table).select().where('id', id).first();
    if(!!!entity && !!throwError){
        throw { code: 404, error: {messages: ["entity not found"]}};
    }

    if(postFunction){
        entity = await postFunction(entity);
    }

    return entity;
}

export const insert = async (table, body, preFunction = null, postFunction = null, fieldList = null) => {
    const timestamp = moment().format();

    if(preFunction){
        body = await preFunction(body);
    }

    let toInsert = {
        created_at: timestamp,
        updated_at: timestamp
    }

    if(!!fieldList){
        fieldList.forEach(key => {
            if(body[key] !== undefined){
                toInsert[key] = body[key];
            }
        });
    } else {
        toInsert = {
            ...body,
            ...toInsert
        }
    }

    let id = await knex(table).insert(toInsert);

    let result =  await knex(table).select().where('id', id).first();

    if(!!postFunction){
        result = await postFunction(result);
    }

    return result
}

export const update = async (id, table, body, preFunction = null, postFunction = null, fieldList = null) => {
    const timestamp = moment().format();

    if(!!!id){
        throw { message: "no id given"};
    }

    if(preFunction){
        body = await preFunction(body);
    }

    const entity = await knex(table).select().where('id', id).first();

    if(!!!entity){
        throw { code: 404, error: {messages : ["entity not found"]}}
    }

    try {
        let toUpdate = {
            updated_at: timestamp
        };
        if(!!fieldList){
            fieldList.forEach(key => {
                if(body[key] !== undefined){
                    toUpdate[key] = body[key];
                }
            });
        } else {
            toUpdate = {
                ...toUpdate,
                ...body
            };
        }
        await knex(table).update(toUpdate).where('id', id);
    } catch(e){
        throw { message: e}
    }

    let result = await knex(table).select().where('id', id).first();

    if(postFunction){
        result = await postFunction(result);
    }

    return result;
}

export const getOneExpress = async (req, res, entityName, params) => {
    try {
        const entity = await getOne(params.id, params.table, params.preFunction, params.postFunction, params.throwError);
        res.status(200).json({success: true, [entityName]: entity});
    } catch(e){
        res.status(e.code ?  e.code : 500).json({error: e.error});
    }
}

export const getAllExpress = async (req, res, entityName, params) => {
    try {
        const entities = await getAll(params.table, params.where, params.pagination, params.preFunction, params.postFunction, params.rightJoin, params.timeRange, params.whereNotNull, params.whereRaw);
        res.status(200).json({success: true, [entityName]: entities.data, total: entities.total});
    } catch(e){
        res.status(e.code ?  e.code : 500).json({error: e.error});
    }
}

export const insertExpress = async (req, res, entityName, params) => {
    try {
        const entity = await insert(params.table, params.body, params.preFunction, params.postFunction, params.fieldList);
        res.status(201).json({success: true, [entityName]: entity});
    } catch(e){
        res.status(e.code ?  e.code : 500).json({error: e.error});
    }
}

export const updateExpress = async  (req, res, entityName, params) => {
    try {
        const entity = await update(params.id, params.table, params.body, params.preFunction, params.postFunction, params.fieldList);
        res.status(200).json({success: true, [entityName]: entity});
    } catch(e){
        console.log('e: ', e)
        res.status(e.code ?  e.code : 500).json({error: e.error});
    }
}

const buildCommunityArrayByUser = (user, queryParams, where) => {
    const isPlaner = user.role === "planer";

    if(!!isPlaner && !!!queryParams.community_id){
        where.community_id = user.communities.map(c => c.id);
    } else {
        if(!!queryParams.community_id){
            where.community_id = queryParams.community_id;
        }
    }
    return where;
}

export const  buildScopeWhereClause = (req) => {
    let where = {};
    const isAdmin = !!req.currentUser.isAdmin;
    const isPlaner = req.currentUser.role === "planer";

    where = buildCommunityArrayByUser(req.currentUser, req.query, where);

    if(!!req.query.sponsorship_id){
        where.sponsorship_id = req.query.sponsorship_id;
    }
    if(!!req.query.typeofcost_id){
        where.typeofcost_id = req.query.typeofcost_id;
    }
    if(!!req.query.machine_id){
        where.machine_id = req.query.machine_id;
    }
    if(!!req.query.stock_id){
        where.stock_id = req.query.stock_id;
    }
    if(!!req.query.product_id){
        where.product_id = req.query.product_id;
    }
    if(!!req.query.user_id){
        where.user_id = req.query.user_id;
    }
    if(!!req.query.category_id){
        where.category_id = req.query.category_id;
    }

    if(!(!!isPlaner || !!isAdmin) && !!!req.query.ignore_user){
        where.user_id = req.currentUser.id;
    }

    let timeRange = {};
    if(!!req.query.from){
        timeRange.from = moment(req.query.from).startOf('day').format();
    } else {
        timeRange.from = moment('01-01-2000', 'MM-DD-YYYY').format()
    }

    if(!!req.query.to){
        timeRange.to = moment(req.query.to).endOf('day').format();
    } else {
        timeRange.to = moment().format()
    }
    return {where, timeRange};
}