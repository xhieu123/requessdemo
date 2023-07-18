import productService from "../services/productService.js";
import fs from "fs";
import * as url from "url";


class ProductController {
    constructor() {
    }
    showAll(req,res){
        let data = '';
        req.on('data',dataRaw=>{
            data += dataRaw;
        })
        req.on('end',()=>{
            if (req.method === 'GET'){
                showlist(req,res);
            }else {
                data = qs.parse(data)
                productService.save(data).then(()=>{
                    showlist(req,res)
                })
            }
        })
    }

    findAll(req, res) {
        fs.readFile('views/product/list.html', 'utf-8', (err, stringHTML) => {
            let str = '';
            productService.findAll().then((products) => {
                for (const item of products) {
                    str += `<h1>${item.name}, ${item.price}</h1>`;
                }
                stringHTML = stringHTML.replace('{list}', str)
                res.write(stringHTML);
                res.end();
            })
        })
    }

    showAddForm(req, res) {
        fs.readFile('views/product/add.html', 'utf-8', (err, stringHTML) => {
            res.write(stringHTML);
            res.end();
        })

    }
    add(req, res) {
        productService.save(req.body).then(() => {
            res.writeHead(301,{'location':'/api/products'})
            res.end()
        })
    }
    showFormEdit(req,res){
        let data = '';
        req.on('data',dataRaw=>{
            data += dataRaw;
        })
        req.on('end',()=>{
            let urlObject = url.parse(req.url,true)
            if (req.method === 'GET'){
                fs.readFile('view/product/edit.html','utf-8',(err,stringHTML)=>{
                    productService.findById(req.body).then((product)=>{
                        stringHTML = stringHTML.replace('{id}',product.id);
                        stringHTML = stringHTML.re
                        place('{name}',product.name);
                        stringHTML = stringHTML.replace('{price}',product.price);
                        stringHTML = stringHTML.replace('{quantity}',product.quantity);
                        stringHTML = stringHTML.replace('{image}',product.image);
                        res.write(stringHTML);
                        res.end();
                    })
                })
            }else {
                data = qs.parse(data);
                productService.update(req.body).then(()=>{
                    res.writeHead(301, {'location': ''}) // chuyển url = js;
                    res.end()
                })
            }
        })
    }
    delete(req,res){
        let urlObject = url.parse(req.url,true)
        productService.deleteId(urlObject.query.idDelete).then(()=>{
            res.writeHead(301, {'location': ''});
            res.end();
        })
    }

}
function showlist(req,res){
    fs.readFile('view/product/list.html','utf-8',(err,stringHTML)=>{
        let str = '';
        productService.findAll(req.body).then((products)=>{
            for (const product of products) {
                str += `${product.image},${product.name},${product.price}`
            }
            stringHTML = stringHTML.replace('####',str)
            res.write(stringHTML);
            res.end();
        })
    })
}

export default new ProductController();
