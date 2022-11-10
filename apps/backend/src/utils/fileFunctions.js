import moment from "moment";
import knex from "../knex";

const fs = require('fs');
const path = require('path');
let multer = require('multer');
let sharp = require('sharp');
let files_folder_public = "public/app";

export function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
            console.log(`Directory ${curDir} created!`);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }

            console.log(`Directory ${curDir} already exists!`);
        }

        return curDir;
    }, initDir);
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export var Base64 = (function () {

    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var Base64 = function () {};

    var _encode = function (value) {

        if (typeof(value) !== 'number') {
            throw 'Value is not number!';
        }

        var result = '', mod;
        do {
            mod = value % 64;
            result = ALPHA.charAt(mod) + result;
            value = Math.floor(value / 64);
        } while(value > 0);

        return result;
    };

    var _decode = function (value) {

        var result = 0;
        for (var i = 0, len = value.length; i < len; i++) {
            result *= 64;
            result += ALPHA.indexOf(value[i]);
        }

        return result;
    };

    Base64.prototype = {
        constructor: Base64,
        encode: _encode,
        decode: _decode
    };

    return Base64;

})();

export const getStorage = (folder) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = folder?folder:files_folder_public;

            /** create file if not exists */
            if (!fs.existsSync(dir)){
                mkDirByPathSync(dir);
            }
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            cb(null, guid() + '.' + file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
        }
    })
}

export const update_file = (file_id, sort = null, title = null) => {
    const timestamp = moment().format();
    var file_new = {};

    return knex.select()
        .from('file')
        .where('id', file_id)
        .first()
        .then(file => {
            if (!file) {
                return null;
            } else {
                if (sort) {
                    file_new.sort = sort;
                }
                if(title){
                    file_new.title = title;
                }
                file_new.updated_at = timestamp;

                knex('file')
                    .where('id', file_id)
                    .update(file_new)
                    .then(result => {
                        get_file(file_id)
                            .then(file => {
                                return file;
                            })
                    });
            }
        });
}

export const get_file = (file_id, user = null) => {
    let where = {
        id: file_id
    };
    if(!!user && user.role !== "admin"){
        where["user_id"] = user.id;
    }

    return knex.select()
        .from('file')
        .where(where).first();
}

export const get_files_new = async (ref_id, ref_type, status = undefined, doc_type = undefined, order_by = undefined, order_by_dir = undefined, filter = undefined, limit = 20, offset = 0) => {
    let whereClauses = {
        'status': 0,
        'doc_type': doc_type
    };

    if(!!ref_id){
        whereClauses.ref_id = ref_id;
    }

    if(!!ref_type){
        whereClauses.ref_type = ref_type;
    }

    if (status !== undefined) {
        if (status == 0) {
            whereClauses.status = 0;
        } else if (status == 'all') {
            delete whereClauses.status;
        } else if (status == 1) {
            whereClauses.status = 1;
        }
    }

    if(doc_type === undefined){
        delete whereClauses['doc_type']
    }

    let whereRaw = "";

    let query = knex.select()
        .from('file')
        .where(whereClauses)
        .whereRaw(whereRaw);

    let countQuery = knex('file').count('id as total')
        .where(whereClauses)
        .whereRaw(whereRaw);

    if(filter !== undefined){
        query = query.andWhereRaw(`title like '%${filter}%'`);
        countQuery = countQuery.andWhereRaw(`title like '%${filter}%'`);
    }
    
    query = query.limit(limit).offset(offset);

    if(order_by === undefined){
        query = query.orderBy('sort', 'asc')
            .orderBy('id', 'asc');
    } else {
        query = query.orderBy(order_by, order_by_dir)
    }

    let files = await query;
    let count = await countQuery;

    return {
        files: files,
        files_total: count?count[0].total:0,
    };
}

export const get_files = (type, status = undefined, sort = undefined, doc_type = undefined) => {
    var whereClauses = {
        'status': 0,
        'sort': sort,
        'doc_type': doc_type
    };

    if(!!type){
        whereClauses.type = type;
    }

    if (status !== undefined) {
        if (status == 0) {
            whereClauses.status = 0;
        } else if (status == 'all') {
            delete whereClauses.status;
        } else if (status == 1) {
            whereClauses.status = 1;
        }
    }

    if(type == null || type == 'all'){
        delete whereClauses['type'];
    }

    if(sort === undefined){
        delete whereClauses['sort']
    }

    if(doc_type === undefined){
        delete whereClauses['doc_type']
    }

    let query = knex.select()
        .from('file')
        .where(whereClauses)
        .orderBy('sort', 'asc')
        .orderBy('id', 'asc');

    return query;
}

export const get_file_by_type = (type) => {
    return knex.select()
        .from('file')
        .where({
            type
        }).first();
}

export const get_file_file = (file_id, width, height, res, user = null) => {
    get_file(file_id, user).then(file => {
        if (file) {
            res.setHeader('content-type', file.content_type);
            res.setHeader('Cache-Control', 'public, max-age=31557600');

            if(width !== undefined && height !== undefined && file.content_type.startsWith("image")) {

                var resizeTransform = sharp().resize({
                    width: parseInt(width),
                    height: parseInt(height),
                    fit: "inside"
                }).jpeg({quality: 70})

                let filePath = path.join(__dirname, "../../", file.file);
                filePath = (""+filePath).split("\\").join("/");
                var stream = fs.createReadStream(filePath);
                stream.on('error', error => {
                    res.status(500).json({ success: false });
                });
                stream.on('open', () => stream.pipe(resizeTransform).pipe(res));
            } else {
                try {
                    let filePath = path.join(__dirname, "../../", file.file);
                    filePath = (""+filePath).split("\\").join("/");
                    console.log('filePath: ', filePath)
                    var stream = fs.createReadStream(filePath);
                    stream.on('error', error => {
                        console.log('error: ', error);
                        res.status(500).json({ success: false });
                    });
                    stream.on('open', () => stream.pipe(res));
                } catch(e){
                    console.error(e);
                }

            }
        } else {
            res.status(500).json({ error: true });
        }
    });
}

export const get_image_base64 = async (file, resizeWith = 1200) => {
    if(file.content_type.startsWith("image")){
        let filePath = path.join(__dirname, "../", file.file);
        if(process.env.NODE_ENV !== "production") {
            filePath = path.join(__dirname, "../../", file.file);
        }

        filePath = (""+filePath).split("\\").join("/");
        return sharp(fs.readFileSync(filePath))
            .resize({ width: resizeWith })
            .toFormat('jpeg')
            .jpeg({
                quality: 100,
                force: true,
            })
            .toBuffer()
            .then(data => {
                return data.toString('base64');
            }).catch(err => {
                console.error(err);
                return null;
            })
    }
}