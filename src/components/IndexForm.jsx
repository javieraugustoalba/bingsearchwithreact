import { useState } from "react";

import {bingSearchOptions, getSubscriptionKey,bingWebSearch} from "../components/utils.js"
import "./IndexForm.css";



function IndexForm() {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(query);
    var formWath = [true, true, true, true];
    bingWebSearch(
      query,
      bingSearchOptions(true, "", formWath, 25, 0),
      getSubscriptionKey()
    );
  };

  return (
    <form name="bing" onSubmit={handleSubmit}>
      <div id="query">
        <h1>Bing Web Search API with React</h1>
        <input
          type="text"
          value={query.value}
          name="query"
          id="term"
          placeholder="Search the Web"
          onChange={(e) => setQuery(e.target.value)}
        />
        <input type="submit" />
        <p>
          Promote
          <input
            type="checkbox"
            name="what"
            id="webpages"
            defaultValue="webpages"
          />
          <label htmlFor="webpages">Web pages</label>
          <input type="checkbox" name="what" id="news" defaultValue="news" />
          <label htmlFor="news">News</label>
          <input
            type="checkbox"
            name="what"
            id="images"
            defaultValue="images"
          />
          <label htmlFor="images">Images</label>
          <input
            type="checkbox"
            name="what"
            id="videos"
            defaultValue="videos"
          />
          <label htmlFor="videos">Videos</label>
          &nbsp;&nbsp;&nbsp;From
          <select name="when">
            <option value="">All time</option>
            <option value="month">Past month</option>
            <option value="week">Past week</option>
            <option value="day">Last 24 hours</option>
          </select>
          &nbsp;&nbsp;&nbsp;
          <input
            type="checkbox"
            id="safe"
            name="safe"
            defaultValue="on"
            defaultChecked=""
          />
          
          <label htmlFor="safe">SafeSearch</label>
          <input type="hidden" name="count" defaultValue={25} />
          <input type="hidden" name="offset" defaultValue={0} />
        </p>
      </div>
    </form>
  );
}

export default IndexForm;
