import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

class HttpRequestUtil extends React.Component {
  getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    const jsonParams = {};

    for (const [key, value] of queryParams.entries()) {
      jsonParams[key] = value;
    }

    return jsonParams;
  }

  render() {
    const jsonParams = this.getQueryParams();
    return jsonParams;
  }
}

export default HttpRequestUtil;

