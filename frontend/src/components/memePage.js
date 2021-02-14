import React,{Component} from 'react';
import axios from 'axios';
import './memePage.css';

var baseURL='http://localhost:8081';

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
            mode:'add',
            meme:null,
            index:null
        }
        this.handleName=this.handleName.bind(this);
        this.handleCaption=this.handleCaption.bind(this);
        this.handleUrl=this.handleUrl.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
        this.makeEdit=this.makeEdit.bind(this);
        this.editHandler=this.editHandler.bind(this);
        this.cancelEdit=this.cancelEdit.bind(this);
    }

    componentDidMount(){
        axios.get(baseURL+'/memes')
        .then((response)=>{
            this.setState({
                memes:response.data
            });
        })
        .catch((error)=>{
            console.log(error);
        })
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

    makeEdit(meme,index) {
        return function(event) {
          event.preventDefault()
          this.setState({
              mode:'edit',
              meme:meme,
              name:meme.name,
              url:meme.url,
              caption:meme.caption,
              index:index
          })
        }.bind(this)
      }

    editHandler(event){
        event.preventDefault();
        if((this.state.url!=this.state.meme.url)||(this.state.caption!=this.state.meme.caption)){
            const config = {
                headers: {
                    'content-type': 'application/json'
                }
            };
            var data = {};
            if(this.state.url!=this.state.meme.url){
                data['url']=this.state.url;
            }
            if(this.state.caption!=this.state.meme.caption){
                data['caption']=this.state.caption;
            }
            axios.patch( baseURL+'/memes/'+this.state.meme.id, data,config)
                .then(id => {
                    let memes=this.state.memes;
                    memes[this.state.index]['caption']=this.state.caption;
                    memes[this.state.index]['url']=this.state.url;
                    this.setState({
                        name:'',
                        caption:'',
                        url:'',
                        memes:memes,
                        meme:null,
                        index:null,
                        mode:'add'
                    })
                })
                .catch(e=>{
                    console.log("meme add request failed. Retry later",e)
                });
        }
    }

    cancelEdit(event){
        event.preventDefault();
        this.setState({
            name:'',
            caption:'',
            url:'',
            meme:null,
            index:null,
            mode:'add'
        })
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
                    {this.state.mode==='add'?(
                        <div className="memeform fixed-top">
                            <div className="memeform container">

                                <div className="alert alert-secondary" role="alert">
                                    <h1 className="alert-heading">Add a New Meme</h1>
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" value={this.state.name} onChange={this.handleName} placeholder="Enter your Name" />
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" value={this.state.caption} onChange={this.handleCaption} placeholder="Enter a caption for the meme" />
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" value={this.state.url} onChange={this.handleUrl} placeholder="Enter the meme URL" />
                                </div>
                                <form onSubmit={this.submitHandler}>
                                    <input className='btn btn-dark mb-3' type="submit" value="Add your meme" />
                                </form>
                                <br />
                            </div>
                        </div>
                    ):(
                        <div className="memeform fixed-top">
                            <div className="memeform container">

                                <div className="alert alert-secondary" role="alert">
                                    <h1 className="alert-heading">Edit the selected Meme</h1>
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" disabled value={this.state.name} onChange={this.handleName} placeholder="Enter your Name" />
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" value={this.state.caption} onChange={this.handleCaption} placeholder="Enter a caption for the meme" />
                                </div>
                                <div className='form-group'>
                                    <input className="form-control" type="text" value={this.state.url} onChange={this.handleUrl} placeholder="Enter the meme URL" />
                                </div>
                                <form onSubmit={this.editHandler}>
                                    <input type="submit" className='btn btn-success mb-3' value="Save Changes"/>
                                </form>
                                <form onSubmit={this.cancelEdit}>
                                    <input type="submit" className='btn btn-warning mb-3' value="Cancel Edit" />
                                </form>
                                <br />
                            </div>
                        </div>
                    )}
                </div>
                <br />
                <div className="meme-part">
                        {
                            this.state.memes.map((meme,index)=>{
                                return (
                                    <div key={meme.id}>
                                        <div className="meme">
                                            <h1>{meme.name}</h1>
                                            <p>{meme.caption}</p>
                                            <img src={meme.url} alt={"meme"+index} />
                                        </div>
                                        <br/>
                                        <form onSubmit={this.makeEdit(meme,index)}>
                                            <input type="submit" className='btn btn-primary mb-3' value="Edit Meme"/>
                                        </form>
                                        <br/>
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