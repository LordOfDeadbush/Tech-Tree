/*
The objective of this code is to read from a .json file and use it to make a useable tech tree.
*/

// import nodes from "./nodes.json" assert { type: 'JSON'};

function convertListOfNodes(nodes, avail=true) {
    var html = "<ul>\n"
    for (var i = 0; i < nodes.length; i++) {
        html += convertNodeToHtml(nodes[i], avail);
    }
    html += "</ul>\n"
    return html;
}

function convertNodeToHtml(node, avail) {
    var html = "<li>\n" + writeNode(node["content"], node["link"], avail, node["complete"], node["classes"]) + "\n";

    if (node["children"].length) html += convertListOfNodes(node["children"], node["complete"]);

    html += "</li>\n";
    return html;
}

function writeNode(content, link, avail, complete, classes) {
    var element = "\n<a";

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


// console.log(nodes);

fetch('nodes.json')
    .then((response) => response.json())
    .then((nodes) => document.getElementById("tech-tree").innerHTML = (convertListOfNodes(nodes)))


// document.getElementById("tech-tree").innerHTML = convertListOfNodes(nodes);
