/*
The objective of this code is to read from a .json file and use it to make a useable tech tree.
*/

const fs = require('fs');
const data = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"500\">\n<foreignObject class=\"node\" x=\"46\" y=\"22\" width=\"800\" height=\"500\">\n<body xmlns=\"http://www.w3.org/1999/xhtml\">\n<style type=\"text/css\">\n/* Copied from the example code */\n* {margin: 0; padding: 0;}\n\n.tree ul {\npadding-top: 20px; position: relative;\ntext-align: center;\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n}\n\n.tree li {\nfloat: left; \ntext-align: center;\nlist-style-type: none;\nposition: relative;\npadding: 20px 5px 0 5px;\n\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n}\n\n/*We will use ::before and ::after to draw the connectors*/\n\n.tree li::before, .tree li::after{\ncontent: '';\nposition: absolute; top: 0; right: 50%;\nborder-top: 1px solid #ccc;\nwidth: 50%; height: 20px;\n}\n.tree li::after{\nright: auto; left: 50%;\nborder-left: 1px solid #ccc;\n}\n\n/*We need to remove left-right connectors from elements without \nany siblings*/\n.tree li:only-child::after, .tree li:only-child::before {\ndisplay: none;\n}\n\n/*Remove space from the top of single children*/\n.tree li:only-child{ padding-top: 0;}\n\n/*Remove left connector from first child and \nright connector from last child*/\n.tree li:first-child::before, .tree li:last-child::after{\nborder: 0 none;\n}\n/*Adding back the vertical connector to the last nodes*/\n.tree li:last-child::before{\nborder-right: 1px solid #ccc;\nborder-radius: 0 5px 0 0;\n-webkit-border-radius: 0 5px 0 0;\n-moz-border-radius: 0 5px 0 0;\n}\n.tree li:first-child::after{\nborder-radius: 5px 0 0 0;\n-webkit-border-radius: 5px 0 0 0;\n-moz-border-radius: 5px 0 0 0;\n}\n\n/*Time to add downward connectors from parents*/\n.tree ul ul::before{\ncontent: '';\nposition: absolute; top: 0; left: 50%;\nborder-left: 1px solid #ccc;\nwidth: 0; height: 20px;\n}\n\n.tree li a{\nborder: 1px solid rgb(204, 204, 204);\npadding: 5px 10px;\ntext-decoration: none;\ntext-align: center;\ncolor: lightgray;\nfont-family: arial, verdana, tahoma;\nfont-size: 11px;\ndisplay: inline-block;\n\nborder-radius: 5px;\n-webkit-border-radius: 5px;\n-moz-border-radius: 5px;\n\ntransition: all 0.5s;\n-webkit-transition: all 0.5s;\n-moz-transition: all 0.5s;\n\nwidth: 100px;\n}\n\n/*Time for some hover effects*/\n.tree li a:hover {\nbackground: rgb(195, 195, 195); color: #000; border: 1px solid #94a0b4;\n}\n/*Connector styles on hover*/\n.tree li a:hover+ul li::after, \n.tree li a:hover+ul li::before, \n.tree li a:hover+ul::before, \n.tree li a:hover+ul ul::before{\nborder-color:  #94a0b4;\n}\n\n/* time to add my own shit*/\n\n.tree li a.avail {\ncolor: yellowgreen;\nfont-weight: bold;\n}\n\n.tree li a.avail:hover {\nbackground-color: rgb(194, 255, 100);\n}\n\n\n.tree li a.complete {\n ;\ncolor: #666;\ntext-decoration: line-through;\n}\n\n.tree li a.complete:hover {\nbackground-color: rgb(70, 70, 70);\n}\n\n/*Thats all. I hope you enjoyed it.\nThanks :)*/            \n</style>\n<div id=\"tech-tree\" class=\"tree\">\n";
function convertListOfNodes(nodes, avail=true) {
    var html = "<ul>\n"
    for (var i = 0; i < nodes.length; i++) {
        html += convertNodeToHtml(nodes[i], avail);
    }
    html += "</ul>\n"
    return html;
}

function convertNodeToHtml(node, avail) {
    var html = "<li>\n" + writeNode(node["content"], node["link"], avail, node["complete"], node["classes"]);

    if (node["children"].length) html += convertListOfNodes(node["children"], node["complete"]);

    html += "</li>\n";
    return html;
}

function writeNode(content, link, avail, complete, classes) {
    var element = "<a";

    element += " href=\"" + link + "\"";

    if (classes.length || (avail || complete)) {
        element += " class=\"";
        if (complete) element += "complete ";
        if (avail && !complete) element += "avail ";
        for (var i = 0; i < classes.length; i++) {
            element += classes[i] + " ";
        }
        element = element.substring(0, element.length-1);
        element += "\""
    }
    element += ">\n";
    element += content;
    element += "\n</a>\n";

    return element;
}

async function writeSVG() {
    var svg = data;
    nodes = require('./nodes.json');
    svg += convertListOfNodes(nodes);
    svg += '</div></body></foreignObject></svg>';

    fs.writeFileSync("svg.svg", svg);
    return svg;
}

writeSVG();
// document.getElementById("tech-tree").innerHTML = convertListOfNodes(nodes);
