(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Button.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<button name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":14},"end":{"line":1,"column":22}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":33}}}) : helper)))
    + "</button>";
},"useData":true});
templates['Input.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input type=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":21}}}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":1,"column":36},"end":{"line":1,"column":51}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":59},"end":{"line":1,"column":67}}}) : helper)))
    + "\" maxlength=\"100\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"input_value") || (depth0 != null ? lookupProperty(depth0,"input_value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"input_value","hash":{},"data":data,"loc":{"start":{"line":1,"column":92},"end":{"line":1,"column":107}}}) : helper)))
    + "\">";
},"useData":true});
templates['LoginPage.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"auth-input\" , data-input-name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":8,"column":59},"end":{"line":8,"column":67}}}) : helper)))
    + "\">\n                    <span class=\"auth-input__title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"input_title") || (depth0 != null ? lookupProperty(depth0,"input_title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"input_title","hash":{},"data":data,"loc":{"start":{"line":9,"column":52},"end":{"line":9,"column":67}}}) : helper)))
    + "</span>\n                    <input type=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":10,"column":33},"end":{"line":10,"column":41}}}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":10,"column":56},"end":{"line":10,"column":71}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":10,"column":79},"end":{"line":10,"column":87}}}) : helper)))
    + "\" maxlength=\"100\">\n                </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"auth-page\">\n    <div class=\"auth-page__form-container\">\n        <h1 class=\"logo-title\">SMAIL</h1>\n        <h1 class=\"auth-form__title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":4,"column":37},"end":{"line":4,"column":46}}}) : helper)))
    + "</h1>\n        <form action=\"\" class=\"auth-form\">\n            <div class=\"auth-form__inputs\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":12,"column":25}}})) != null ? stack1 : "")
    + "            </div>\n            <div class=\"auth-input__error\"></div>\n            <div class=\"auth-form__actions\"></div>\n        </form>\n    </div>\n</div>";
},"useData":true});
templates['MainPage.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"main-page\">\n    <aside class=\"sidebar shadow\">\n        <h2>Sidebar</h2>\n        <nav>...</nav>\n    </aside>\n\n    <div class=\"right-part\">\n        <div class=\"top-bar\">\n            <div class=\"search-bar\">\n                <input class=\"search-input shadow\" type=\"text\" placeholder=\"Search\">\n            </div>\n        </div>\n        <div class=\"mail-tile shadow\">\n            <!-- Fixed header inside the tile -->\n            <div class=\"mail-tile-header\">\n                <h2>\n                    Inbox\n                    <span class=\"mail-count\">12</span>\n                </h2>\n                <p>Your latest messages</p>\n            </div>\n\n            <!-- Scrollable list of emails -->\n            <div class=\"mail-list\">\n                <div class=\"mail-item unread\">\n                    <strong>John Doe</strong>\n                    <p>Meeting tomorrow</p>\n                    <small>10:30 AM</small>\n                </div>\n                <div class=\"mail-item\">\n                    <strong>Jane Smith</strong>\n                    <p>Project update</p>\n                    <small>Yesterday</small>\n                </div>\n                <div class=\"mail-item\">\n                    <strong>Mike Johnson</strong>\n                    <p>Lunch next week?</p>\n                    <small>Yesterday</small>\n                </div>\n                <!-- Add more items to test scrolling -->\n                <div class=\"mail-item\">Item 4</div>\n                <div class=\"mail-item\">Item 5</div>\n                <div class=\"mail-item\">Item 6</div>\n                <div class=\"mail-item\">Item 7</div>\n                <div class=\"mail-item\">Item 8</div>\n                <div class=\"mail-item\">Item 9</div>\n                <div class=\"mail-item\">Item 10</div>\n                <div class=\"mail-item\">Item 4</div>\n                <div class=\"mail-item\">Item 5</div>\n                <div class=\"mail-item\">Item 6</div>\n                <div class=\"mail-item\">Item 7</div>\n                <div class=\"mail-item\">Item 8</div>\n                <div class=\"mail-item\">Item 9</div>\n                <div class=\"mail-item\">Item 10</div>\n                <div class=\"mail-item\">Item 4</div>\n                <div class=\"mail-item\">Item 5</div>\n                <div class=\"mail-item\">Item 6</div>\n                <div class=\"mail-item\">Item 7</div>\n                <div class=\"mail-item\">Item 8</div>\n                <div class=\"mail-item\">Item 9</div>\n                <div class=\"mail-item\">Item 10</div>\n            </div>\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['RegPage.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"auth-input\" , data-input-name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":8,"column":59},"end":{"line":8,"column":67}}}) : helper)))
    + "\">\n                    <span class=\"auth-input__title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"input_title") || (depth0 != null ? lookupProperty(depth0,"input_title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"input_title","hash":{},"data":data,"loc":{"start":{"line":9,"column":52},"end":{"line":9,"column":67}}}) : helper)))
    + "</span>\n                    <input type=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":10,"column":33},"end":{"line":10,"column":41}}}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":10,"column":56},"end":{"line":10,"column":71}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":10,"column":79},"end":{"line":10,"column":87}}}) : helper)))
    + "\" maxlength=\"100\"\n                        value=\""
    + alias4(lookupProperty(helpers,"lookup").call(alias1,(depths[1] != null ? lookupProperty(depths[1],"input_value") : depths[1]),(depth0 != null ? lookupProperty(depth0,"name") : depth0),{"name":"lookup","hash":{},"data":data,"loc":{"start":{"line":11,"column":31},"end":{"line":11,"column":61}}}))
    + "\">\n                </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"auth-page\">\n    <div class=\"auth-page__form-container\">\n        <h1 class=\"logo-title\">SMAIL</h1>\n        <form action=\"\" class=\"auth-form\">\n            <h1 class=\"auth-form__title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":5,"column":41},"end":{"line":5,"column":50}}}) : helper)))
    + "</h1>\n            <div class=\"auth-form__inputs\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":13,"column":25}}})) != null ? stack1 : "")
    + "            </div>\n            <div class=\"auth-input__error\"></div>\n            <div class=\"auth-form__actions\"></div>\n        </form>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
})();