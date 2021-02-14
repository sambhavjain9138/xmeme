import React,{Component} from 'react';
import axios from 'axios';
import './memePage.css';

var baseURL='https://sambhav-xmeme.herokuapp.com';

class MemePage extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            name:'',
            caption:'',
            url:'',
            memes:[],
            mode:'add'
        }
        this.handleName=this.handleName.bind(this);
        this.handleCaption=this.handleCaption.bind(this);
        this.handleUrl=this.handleUrl.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
            axios.get(baseURL+'/memes')
            .then((response)=>{
                this.setState({
                    memes:response.data
                });
            })
            .catch((error)=>{
                console.log(error);
            })
        },1000);
    }

    handleName(event){
        this.setState({
            name: event.target.value
        })
    }

    handleCaption(event){
        this.setState({
            caption:event.target.value
        });
    }

    handleUrl(event){
        this.setState({
            url:event.target.value
        });
    }

    submitHandler(event){
        event.preventDefault();
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        };
        var data = {'name':this.state.name,
               'caption':this.state.caption,
               'url':this.state.url
    }
        axios.post( baseURL+'/memes', data,config)
            .then(id => {
                let memes=this.state.memes;
                if(memes.length>=100){
                    memes.pop();
                }
                memes.unshift({
                    "id": id,
                    "name": this.state.name,
                    "caption": this.state.caption,
                    "url":this.state.url
                });
                this.setState({
                    name:'',
                    caption:'',
                    url:'',
                    memes:memes
                })
            })
            .catch(e=>{
                console.log("meme add request failed. Retry later",e)
            });
    }

    render()
    {
        return (
            <div className="container">
                <div className="form-part">
                    <h1>Add a New Meme</h1>
                    <form onSubmit={this.submitHandler}>
                        <div>
                            <input type="text" value={this.state.name} onChange={this.handleName} placeholder="enter your name" />
                        </div>
                        <div>
                            <input type="text" value={this.state.caption} onChange={this.handleCaption} placeholder="enter a caption for the meme" />
                        </div>
                        <div>
                            <input type="text" value={this.state.url} onChange={this.handleUrl} placeholder="enter the meme URL" />
                        </div>
                        <input type="submit" />
                    </form>
                </div>
                <div className="meme-part">
                    {
                        this.state.memes.map((meme,index)=>{
                            return (
                                <div key={meme.id} className="meme">
                                    <h1>{meme.name}</h1>
                                    <p>{meme.caption}</p>
                                    <img src={meme.url} alt={"meme"+index} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
};


export default MemePage;