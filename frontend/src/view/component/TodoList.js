import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import { BACKEND_API_CALL } from "../util/Constant.js";




class TodoList extends React.Component {

    state = {
        data: null,
         httpErrorMessage:null, 
         isLoading: false, 
         requestBody:{
            'key': null,
            'question':null,
            'value':null
         }, 
         responseBody:{
            
         }
        };

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
        const { httpErrorMessage, isLoading, data, requestBody} = this.state

        const handleChange = (event, todoKey, todoQuestion) => {
            const selectedValue = event.target.value
            requestBody = {
                'key': todoKey,
                'question':todoQuestion,
                'value':selectedValue
             };
            this.setState({requestBody:requestBody})
            
            //------------------------
            const url = BACKEND_API_CALL + '/todo-list';
            //calling api for data
            const postRecord = async () => {
                try {
                    this.setState({isLoading: true})
                    const responseBody =  await HttpClient.post(url, requestBody);
                    this.setState({responseBody:responseBody, httpErrorMessage:null});
                } catch (error) {
                    console.error('Error fetching data:', error);
                    this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
                } finally {
                    this.setState({isLoading: false})
                }
            };
            postRecord()
          };


            return (
            <div><ErrorBoundary>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
                {data && data.map((todoListObj) => (

                        <div className="card">
                            <p>{todoListObj.question}</p>
                            {todoListObj.options.map((option) => (
                                
                                <div>
                                    <input type="radio" id="html" name={todoListObj.key} onChange={(event) => handleChange(event, todoListObj.key, todoListObj.question)} value={option}/>
                                      <label for="html">{option}</label><br/>
                                </div>
                            ))}
                             
                        </div>
                  
                    )
                    )}

            </ErrorBoundary></div>
            );
     }
}


export default TodoList;