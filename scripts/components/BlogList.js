var React = require("react");
var Pages = require("./Pagination");
var Modal = require("react-modal");
var _ = require("backbone/node_modules/underscore");
var NewPost = require("./NewPost");
var SingleView = require("./SingleView");
var BlogCollection = require("../collections/BlogCollection");
var FakePost = require("../models/BlogModel");
var blogCollection = new BlogCollection();

var containerEl = document.getElementById("container");
Modal.setAppElement(containerEl);
Modal.injectCSS()

module.exports = React.createClass({
	componentWillMount: function(){
		if(blogCollection.length === 0){
			for(var i = 0; i < 16; i++){
				var fakePost = new FakePost();
				fakePost.set("id", i);
				fakePost.set("title", "Title "+i);
				fakePost.set("feelings", "content "+i);
				if(i < 10){
					fakePost.set("createdAt", new Date('December 17, 1995 03:24:0'+i));
				} else {
					fakePost.set("createdAt", new Date('December 17, 1995 03:24:'+i));
				}
				blogCollection.add(fakePost);
			}
		}
	},
	getInitialState: function() {
		return { 
			modalIsOpen: false,
			modalIsOpen2: false, 
			modelToGet: null
		};
	 },
	render: function(){
		var links = [];
		var button = [];
		if(this.props.user.userType === "admin"){
			button.push(<button key="add button" onClick={this.openModal} className="btn btn-primary">Submit a New Post!</button>);
			links.push(<button key="button1" className="btn btn-info space">Edit</button>);
			links.push(<button key="button2" className="btn btn-info space">Delete</button>);
		}
		var that = this;
		var sortedCollection = _.sortBy(blogCollection.models, function(blog){
			return -1*blog.get("createdAt").getTime();
		});
		var pagedContent = pagination(sortedCollection,this.props.page);
		var blogs = pagedContent.map(function(blog, index){
			return (
			<div key={blog.cid} className="blog-card center-block">
				<button className="btn btn-primary" value={blog.id} onClick={that.openModal2}>View</button>
				<div className="text-center">
					<h3>{blog.get("title")}</h3>
				</div>
				<div className="content-box padit">
					<p>{blog.get("feelings")}</p>
				</div>
				{links}
			</div>
			);
		});
		return (
		<div>
			<div className="text-center">
				<h1>Recent Posts!</h1>
				{button}
			</div>
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
				<NewPost closeModal={this.closeModal} blogCollection={blogCollection}/>
			</Modal>
			<Modal isOpen={this.state.modalIsOpen2} onRequestClose={this.closeModal2}>
				<SingleView closeModal={this.closeModal2} blog={blogCollection.get(this.state.modelToGet)}/>
			</Modal>
			<br/>
			{blogs}
			<Pages page={this.props.page} myRoutes={this.props.myRoutes} user={this.props.user} content={blogCollection} />
		</div>
		);
	},
	openModal: function() {
		this.setState({modalIsOpen: true});
	},
	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	openModal2: function() {
		this.setState({modalIsOpen2: true, modelToGet:event.target.value});
	},
	closeModal2: function() {
		this.setState({modalIsOpen2: false});
	},
});
function pagination(array, page){
	var sectionOf = [];
	var start = 0;
	var stop = 0;
	var index = 0;
	for(var i = 1; i < page; i++){
		start+=5;
	}
	stop = start + 4;
	if(stop > array.length-1){
		stop = array.length-1;
	}
	for(var j = start; j <= stop; j++){
		sectionOf.push(array[j]);
	}
	return sectionOf;
}
