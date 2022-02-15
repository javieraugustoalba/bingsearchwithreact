 // Do not enter your credentials.
import ReactDOM from 'react-dom';
import PaginationComponent from "./PaginationComponent";

 var API_KEY_COOKIE = "3fc0a55d637a48aebb776fb51079b155";
var CLIENT_ID_COOKIE = "bing-search-client-id";
var width = 0;
var height = 0;

 // Go to the next page (used by next page link).
 export const doNextSearchPage = () => {
    var bing = document.forms.bing;
    var query = bing.query.value;
    var offset = parseInt(bing.offset.value, 10);
    var count = parseInt(bing.count.value, 10);
    offset += count;
    bing.offset.value = offset;
    var formWath = [true, true, true, true];
    return bingWebSearch(
      query,
      bingSearchOptions(true, "", formWath, 10, 10),
      getSubscriptionKey()
    );
  }
  
  // Go to the previous page (used by previous page link).
  export const doPrevSearchPage = () => {
    var bing = document.forms.bing;
    var query = bing.query.value;
    var offset = parseInt(bing.offset.value, 10);
    var count = parseInt(bing.count.value, 10);
    if (offset) {
      offset -= count;
      if (offset < 0) offset = 0;
      bing.offset.value = offset;
      var formWath = [true, true, true, true];
      return bingWebSearch(
        query,
        bingSearchOptions(true, "", formWath, 10, 10),
        getSubscriptionKey()
      );
    }
    alert("You're already at the beginning!");
    return false;
  }

  export const bingWebSearch = (query, options, key) => {
    // Scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false; // empty query, do nothing
  
    showDiv("noresults", "Working. Please wait.");
    hideDivs(
      "pole",
      "mainline",
      "sidebar",
      "_json",
      "_headers",
      "paging1",
      "paging2",
      "error"
    );
  
    var endpoint = "https://api.bing.microsoft.com/v7.0/search";
    var request = new XMLHttpRequest();
    var queryurl = endpoint + "?q=" + encodeURIComponent(query) + "&" + options;
  
    try {
      request.open("GET", queryurl);
    } catch (e) {
      renderErrorMessage("Bad request (invalid URL)\n" + queryurl);
      return false;
    }
  
    // Add request headers.
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    request.setRequestHeader("Accept", "application/json");
    var clientid = CLIENT_ID_COOKIE;
    if (clientid) request.setRequestHeader("X-MSEdge-ClientID", clientid);
  
    // Event handler for successful response.
    request.addEventListener("load", handleOnLoad);
  
    // Event handler for erorrs.
    request.addEventListener("error", function () {
      renderErrorMessage("Error completing request");
    });
  
    // Event handler for aborted request.
    request.addEventListener("abort", function () {
      renderErrorMessage("Request aborted");
    });
  
    // Send the request.
    request.send();
    return false;
  }
  
  // Build query options from the HTML form.
  export const bingSearchOptions = (safe, whenValue, formWhat, countValue, offsetValue) => {
    var options = [];
  
    options.push("mkt=en-US"); // options.push("mkt=" + form.where.value); //market options only for US--- for activate others please uncomment the dropdown markets
    options.push("SafeSearch=" + (safe ? "strict" : "moderate"));
    if (whenValue != null || whenValue !== "")
      options.push("freshness=" + whenValue);
    var what = [];
    for (var i = 0; i < formWhat.length; i++)
      if (formWhat[i].checked) what.push(formWhat[i].value);
    if (what.length) {
      options.push("promote=" + what.join(","));
      options.push("answerCount=9");
    }
    options.push("count=" + countValue);
    options.push("offset=" + offsetValue);
    options.push("textDecorations=true");
    options.push("textFormat=HTML");
    return options.join("&");
  }
  
  export const getSubscriptionKey = () => {
    var key = API_KEY_COOKIE;
    while (key.length !== 32) {
      key = prompt("Enter Bing Search API subscription key:", "").trim();
    }
    // Always set the cookie in order to update the expiration date.
    API_KEY_COOKIE = key;
    return key;
  }
  // Put HTML markup into a <div> and reveal it
function showDiv(id, html) {
    var content = document.getElementById("_" + id);
    if (content) content.innerHTML = html;
    var wrapper = document.getElementById(id);
    if (wrapper) wrapper.style.display = html.trim() ? "block" : "none";
  }
  
  // Get the host portion of a URL, stripping out search result formatting.
  function getHost(url) {
    return url
      .replace(/<\/?b>/g, "")
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^www\./, "");
  }
  
  // Render functions for various types of search results.
  var searchItemRenderers = {
    // Render Web page result.
    webPages: function (item) {
      var html = [];
      html.push(
        "<p class='webPages'><a href='" + item.url + "'>" + item.name + "</a>"
      );
      html.push(" (" + getHost(item.displayUrl) + ")");
      html.push("<br>" + item.snippet);
      if ("deepLinks" in item) {
        var links = [];
        for (var i = 0; i < item.deepLinks.length; i++) {
          links.push(
            "<a href='" +
              item.deepLinks[i].url +
              "'>" +
              item.deepLinks[i].name +
              "</a>"
          );
        }
        html.push("<br>" + links.join(" - "));
      }
      return html.join("");
    },
    // Render news article result.
    news: function (item) {
      var html = [];
      html.push("<p class='news'>");
      if (item.image) {
        width = 60;
        height = Math.round(
          (width * item.image.thumbnail.height) / item.image.thumbnail.width
        );
        html.push(
          "<img src='" +
            item.image.thumbnail.contentUrl +
            "&h=" +
            height +
            "&w=" +
            width +
            "' width=" +
            width +
            " height=" +
            height +
            ">"
        );
      }
      html.push("<a href='" + item.url + "'>" + item.name + "</a>");
      if (item.category) html.push(" - " + item.category);
      if (item.contractualRules) {
        // MUST display source attributions
        html.push(" (");
        var rules = [];
        for (var i = 0; i < item.contractualRules.length; i++)
          rules.push(item.contractualRules[i].text);
        html.push(rules.join(", "));
        html.push(")");
      }
      html.push(" (" + getHost(item.url) + ")");
      html.push("<br>" + item.description);
      return html.join("");
    },
    // Render image result using thumbnail.
    images: function (item, section, index, count) {
      var height = 60;
      var width = Math.round(
        (height * item.thumbnail.width) / item.thumbnail.height
      );
      var html = [];
      if (section === "sidebar") {
        if (index) html.push("<br>");
      } else {
        if (!index) html.push("<p class='images'>");
      }
      html.push("<a href='" + item.hostPageUrl + "'>");
      var title =
        escapeQuotes(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
      html.push(
        "<img src='" +
          item.thumbnailUrl +
          "&h=" +
          height +
          "&w=" +
          width +
          "' height=" +
          height +
          " width=" +
          width +
          " title='" +
          title +
          "' alt='" +
          title +
          "'>"
      );
      html.push("</a>");
      return html.join("");
    },
    // Render video result using thumbnail.
    videos: function (item, section, index, count) {
      // Videos are rendered like images.
      return searchItemRenderers.images(item, section, index, count);
    },
    relatedSearches: function (item, section, index, count) {
      var html = [];
      if (section !== "sidebar")
        html.push(index === 0 ? "<h2>Related</h2>" : " - ");
      else html.push("<p class='relatedSearches'>");
      html.push(
        "<a href='#' onclick='return doRelatedSearch(&quot;" +
          escapeQuotes(item.text) +
          "&quot;)'>"
      );
      html.push(item.displayText + "</a>");
      return html.join("");
    },
  };
  
  // Hides the specified <div>s.
  function hideDivs() {
    for (var i = 0; i < arguments.length; i++) {
      var element = document.getElementById(arguments[i]);
      if (element) element.style.display = "none";
    }
  }
  
  function renderErrorMessage(message) {
    showDiv("error", preFormat(message));
    showDiv("noresults", "No results.");
  }
  
  // Format plain text for display as an HTML <pre> element.
  function preFormat(text) {
    text = "" + text;
    return "<pre>" + text.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</pre>";
  }
  
  function handleOnLoad() {
    hideDivs("noresults");
  
    var json = this.responseText.trim();
    var jsobj = {};
  
    // Try to parse the JSON results.
    try {
      if (json.length) jsobj = JSON.parse(json);
    } catch (e) {
      renderErrorMessage("Invalid JSON response");
    }
  
    // Show raw JSON and headers.
    showDiv("json", preFormat(JSON.stringify(jsobj, null, 2)));
    showDiv(
      "http",
      preFormat(
        "GET " +
          this.responseURL +
          "\n\nStatus: " +
          this.status +
          " " +
          this.statusText +
          "\n" +
          this.getAllResponseHeaders()
      )
    );
  
    // If HTTP response is 200 OK, then try to render search results.
    if (this.status === 200) {
      // var clientid = this.getResponseHeader("X-MSEdge-ClientID");
      // if (clientid) retrieveValue(CLIENT_ID_COOKIE, clientid);
      if (json.length) {
        if (jsobj._type === "SearchResponse" && "rankingResponse" in jsobj) {
          renderSearchResults(jsobj);
        } else {
          renderErrorMessage("No search results in JSON response");
        }
      } else {
        renderErrorMessage(
          "Empty response (are you sending too many requests too quickly?)"
        );
      }
    }
  
    // Any other HTTP response is an error.
    else {
      // 401 is unauthorized; force re-prompt for API key for next request
      if (this.status === 401) invalidateSubscriptionKey();
  
      // Some error responses don't have a top-level errors object.
      var errors = jsobj.errors || [jsobj];
      var errmsg = [];
  
      // Display HTTP status code.
      errmsg.push("HTTP Status " + this.status + " " + this.statusText + "\n");
  
      // Add all fields from all error responses.
      for (var i = 0; i < errors.length; i++) {
        if (i) errmsg.push("\n");
        for (var k in errors[i]) errmsg.push(k + ": " + errors[i][k]);
      }
  
      // Display Bing Trace ID if it isn't blocked by CORS.
      var traceid = this.getResponseHeader("BingAPIs-TraceId");
      if (traceid) errmsg.push("\nTrace ID " + traceid);
  
      // Display the error message.
      renderErrorMessage(errmsg.join("\n"));
    }
  }
  
  function invalidateSubscriptionKey() {
    API_KEY_COOKIE = "";
  }
  
  function renderSearchResults(results) {
    // If spelling was corrected, update the search field.
    if (results.queryContext.alteredQuery)
      document.forms.bing.query.value = results.queryContext.alteredQuery;
  
    // Add Prev / Next links with result count.
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);
  
    // For each possible section, render the resuts from that section.
    for (results.section in { pole: 0, mainline: 0, sidebar: 0 }) {
      if (results.rankingResponse[results.section])
        showDiv(results.section, renderResultsItems(results.section, results));
    }
  }
  
  // Render search results from the rankingResponse object in a specified order.
  function renderResultsItems(section, results) {
    var items = results.rankingResponse[section].items;
    var html = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      // Collection name has lowercase first letter while answerType has
      // uppercase. For example: `WebPages` rankingResult type is in the
      // `webPages` top-level collection.
      var type = item.answerType[0].toLowerCase() + item.answerType.slice(1);
      // Must have results of the given type AND a renderer for it.
      if (type in results && type in searchItemRenderers) {
        var render = searchItemRenderers[type];
        // This ranking item refers to ONE result of the specified type.
        if ("resultIndex" in item) {
          html.push(render(results[type].value[item.resultIndex], section));
          // This ranking item refers to ALL results of the specified type.
        } else {
          var len = results[type].value.length;
          for (var j = 0; j < len; j++) {
            html.push(render(results[type].value[j], section, j, len));
          }
        }
      }
    }
    return html.join("\n\n");
  }
  
  // Generate the HTML for paging links (prev/next).
  function renderPagingLinks(results) {
    var html = [];
    var bing = document.forms.bing;
    var offset = parseInt(bing.offset.value, 10);
    var count = parseInt(bing.count.value, 10);
    html.push(
      "<p class='paging'><i>Results " + (offset + 1) + " to " + (offset + count)
    );
    html.push(" of about " + results.webPages.totalEstimatedMatches + ".</i> ");
    ReactDOM.render(
      <PaginationComponent donext={doNextSearchPage} doPrev></PaginationComponent>,
      document.getElementById('buttonspagin')
    );  
    return html.join("");
  }
  
  // Escape quotes to HTML entities for use in HTML tag attributes.
  function escapeQuotes(text) {
    return text.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
  }
  
  // Render functions for various types of search results.
  searchItemRenderers = {
    // Render Web page result.
    webPages: function (item) {
      var html = [];
      html.push(
        "<p class='webPages'><a href='" + item.url + "'>" + item.name + "</a>"
      );
      html.push(" (" + getHost(item.displayUrl) + ")");
      html.push("<br>" + item.snippet);
      if ("deepLinks" in item) {
        var links = [];
        for (var i = 0; i < item.deepLinks.length; i++) {
          links.push(
            "<a href='" +
              item.deepLinks[i].url +
              "'>" +
              item.deepLinks[i].name +
              "</a>"
          );
        }
        html.push("<br>" + links.join(" - "));
      }
      return html.join("");
    },
    // Render news article result.
    news: function (item) {
      var html = [];
      html.push("<p class='news'>");
      if (item.image) {
        width = 60;
        height = Math.round(
          (width * item.image.thumbnail.height) / item.image.thumbnail.width
        );
        html.push(
          "<img src='" +
            item.image.thumbnail.contentUrl +
            "&h=" +
            height +
            "&w=" +
            width +
            "' width=" +
            width +
            " height=" +
            height +
            ">"
        );
      }
      html.push("<a href='" + item.url + "'>" + item.name + "</a>");
      if (item.category) html.push(" - " + item.category);
      if (item.contractualRules) {
        // MUST display source attributions
        html.push(" (");
        var rules = [];
        for (var i = 0; i < item.contractualRules.length; i++)
          rules.push(item.contractualRules[i].text);
        html.push(rules.join(", "));
        html.push(")");
      }
      html.push(" (" + getHost(item.url) + ")");
      html.push("<br>" + item.description);
      return html.join("");
    },
    // Render image result using thumbnail.
    images: function (item, section, index, count) {
      var height = 60;
      var width = Math.round(
        (height * item.thumbnail.width) / item.thumbnail.height
      );
      var html = [];
      if (section === "sidebar") {
        if (index) html.push("<br>");
      } else {
        if (!index) html.push("<p class='images'>");
      }
      html.push("<a href='" + item.hostPageUrl + "'>");
      var title =
        escapeQuotes(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
      html.push(
        "<img src='" +
          item.thumbnailUrl +
          "&h=" +
          height +
          "&w=" +
          width +
          "' height=" +
          height +
          " width=" +
          width +
          " title='" +
          title +
          "' alt='" +
          title +
          "'>"
      );
      html.push("</a>");
      return html.join("");
    },
    // Render video result using thumbnail.
    videos: function (item, section, index, count) {
      // Videos are rendered like images.
      return searchItemRenderers.images(item, section, index, count);
    },
    relatedSearches: function (item, section, index, count) {
      var html = [];
      if (section !== "sidebar")
        html.push(index === 0 ? "<h2>Related</h2>" : " - ");
      else html.push("<p class='relatedSearches'>");
      html.push(
        "<a href='#' onclick='return doRelatedSearch(&quot;" +
          escapeQuotes(item.text) +
          "&quot;)'>"
      );
      html.push(item.displayText + "</a>");
      return html.join("");
    },
  };
  
  