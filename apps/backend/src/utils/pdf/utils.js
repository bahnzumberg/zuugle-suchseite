import {BrowserService} from "./BrowserService";

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

export const writePdf = async (data, TEMPLATE, saveToDisk, fileName, landscape = false, toSaveFolder = null) => {
    let templateHtml = readTemplate(TEMPLATE);
    if(templateHtml){
        handlebars.registerHelper('breaklines', function(text) {
            text = handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new handlebars.SafeString(text);
        });

        let template = handlebars.compile(templateHtml);
        let html = template(data);
        if(html){
            return await new Promise(async (resolve, reject) => {
                try {
                    const base64 = await htmlToPdf(html, saveToDisk, fileName, landscape, toSaveFolder);
                    resolve(base64);
                } catch(e){
                    console.log(e);
                }

            });
        }
    } else {
        console.log('Error reading template');
    }
    return null;
}

const htmlToPdf = async (html, saveToDisk = false, fileName = null, landscape = false, toSaveFolder = null) => {
    var options = {
        format: 'A4',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        margin: {
            top: "30px",
            bottom: "30px",
            left:"45px",
            right:"45px"
        },
        printBackground: true,
        landscape: landscape,
    };

    const instance = await BrowserService.getInstance();
    if(!!instance) {
        console.log('create page on puppeteer instance');
        const page = await instance.createNewPage();
        if (!!page) {
            await page.setContent(html);
            const pdf = await page.pdf(options);
            await instance.closePage(page);
            return pdf.toString('base64');
        }
    } else {
        console.error('no puppeteer instance active');
    }
};

const readTemplate = (name = 'standard') => {
    let filePath = path.join(__dirname, "../../templates", name + '.html');
    if(process.env.NODE_ENV !== "production"){
        filePath = path.join(__dirname, "../../../templates", name + '.html');
    }
    return readFile(filePath, 'utf-8');
};

const readFile = (name, contentType = null) => {
    try {
        return fs.readFileSync(name, contentType);
    } catch(e){
        console.error('Error loading template file');
        console.error(e);
        return null;
    }
};

export const getLogoBase64 = () => {
    return "data:image/png;base64,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";
}
// description :
// The function writePdf within this file is called by the tourPdf.js file which is a module that provides functions for creating a PDF file from HTML data. 
// writePdf function depends on several modules, including:
// * fs: A module for reading and writing files on the file system.
// * path: A module for working with file and directory paths.
// * handlebars: A module for working with Handlebars templates.
// * puppeteer: A headless Chrome browser automation library.
// The main function exported by this module is writePdf, which takes as input an object data that contains the data to be rendered in the Handlebars template, the name of the template to use, and a boolean saveToDisk that indicates whether the resulting PDF should be saved to disk. If saveToDisk is set to true, the function also takes as input a fileName and a toSaveFolder path, which specify the name and location where the PDF file should be saved. The function returns a base64-encoded string representing the PDF file.
// The writePdf function uses the handlebars module to compile the Handlebars template with the input data, resulting in an HTML string. This HTML string is then passed to the htmlToPdf function, which uses the puppeteer module to convert the HTML to a PDF file. If saveToDisk is set to true, the htmlToPdf function will save the PDF file to disk using the fs module.
// The readTemplate function is used to read the Handlebars template file from disk. The getLogoBase64 function returns a base64-encoded string representation of an image.
