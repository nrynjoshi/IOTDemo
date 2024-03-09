import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"




class TodoList extends React.Component {

    state = {data: null, httpErrorMessage:null, isLoading: false};

    componentDidMount() {
        const url = this.props.dataEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({isLoading: true})
              const data =  await HttpClient.get(url);
              this.setState({data:data, httpErrorMessage:null});
            } catch (error) {
              console.error('Error fetching data:', error);
              this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({isLoading: false})
            }
          };

          fetchData();

    }



     render(){
        const { httpErrorMessage, isLoading, data} = this.state

         const handleChange = () => {
            console.log("clicked checkbox")
          };

            return (
            <div><ErrorBoundary>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
                {data && data.map((todoListObj) => (

                    <label>
                        <input
                            type="checkbox"
                            // checked={checked}
                            defaultValue={todoListObj.key}
                            onChange={handleChange}
                        />
                        {todoListObj.value} <br/>
                    </label>
                )
                    )}

            </ErrorBoundary></div>
            );
     }
}


export default TodoList;