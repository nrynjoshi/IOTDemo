import React from "react";

class PageTitle extends React.Component {

   render() {
      const title = this.props.title;
      return (
         <div className="min-w-full ">
            <h1><span className="text-3xl font-bold mb-1">{title}</span></h1>
         </div>
      );
   }
}

export default PageTitle;