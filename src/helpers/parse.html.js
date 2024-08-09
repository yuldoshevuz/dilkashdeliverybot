const parseHtml = (html) => html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default parseHtml