const fs = require("fs")
const url = require("url")
const http = require("http")
const axios = require("axios")


let urlProveedores = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json"
let urlClientes = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json"

let objProveedores
let objClientes


let renderProveedores = (callback) => {
    fs.readFile("index.html", (err, data) => {
        let html = ''
        let htmlSegment = ''


        
        objProveedores.map(evento => {
                
            htmlSegment =   `<tr>
                                    <th>${evento.idproveedor}</th>
                                    <td>${evento.nombrecompania}</td>
                                    <td>${evento.nombrecontacto}</td>
                            </tr>`

            html += htmlSegment
        })
        


        let pageContent = data.toString()
        pageContent = pageContent.replace("{{replace}}", "Proveedores")
        pageContent = pageContent.replace("{{cuerpo}}", html)
        callback(pageContent)

    })
}

let renderClientes = (callback) => {
    fs.readFile("index.html", (err, data) => {
        let html = ''
        let htmlSegment = ''

        
        objClientes.map(evento => {
                
            htmlSegment =   `<tr>
                                    <th>${evento.idCliente}</th>
                                    <td>${evento.NombreCompania}</td>
                                    <td>${evento.NombreContacto}</td>
                            </tr>`

            html += htmlSegment
        })
        

        let pageContent = data.toString()
        pageContent = pageContent.replace("{{replace}}", "Clientes")
        pageContent = pageContent.replace("{{cuerpo}}", html)
        callback(pageContent)

    })
}

let getProveedoresJSON = (callback) => {
    axios.get(urlProveedores).then( response => {
        objProveedores = response.data
        renderProveedores( (data) => {
            callback(data.toString())
        })
    })
}

let getClientesJSON = (callback) => {
    axios.get(urlClientes).then( response => {
        objClientes = response.data
        renderClientes( (data) => {
            callback(data.toString())
        })
    })
}


http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"})
    if(url.parse(req.url, true).path === "/api/proveedores"){
        getProveedoresJSON((data) => {
            res.end(data.toString())
        })
    }else if(url.parse(req.url, true).path === "/api/clientes"){
        getClientesJSON((data) => {
            res.end(data.toString())
        })
    }
    

}).listen(8081)
