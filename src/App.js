import React, { Component } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet'

const Div = styled.div`
	height: 20px;
	width: 20px;
	
	display: inline-block;
	border: 1px solid black;
	margin-right: 1px;
 }
`;

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.endPaintEvent = this.endPaintEvent.bind(this);
		this.onColorClick = this.onColorClick.bind(this);
		this.saveImage = this.saveImage.bind(this);
		this.state = {
			myStrokeStyle: 'white',
		}
	};

	

	isPainting = false;
	//myStrokeStyle = 'white';
	line = [];
	prevPos = { offsetX: 0, offsetY: 0 };

	onMouseDown({ nativeEvent }) {
		this.prevPos = nativeEvent;
		this.isPainting = true;
	}
	onMouseMove({ nativeEvent }) {
		if (this.isPainting) {
			const offSetData = nativeEvent;
			// Set the start and stop position of the paint event.
			const positionData = {
				start: { ...this.prevPos },
				stop: { ...offSetData },
			};
			//console.log("prevPos: " + this.prevPos.offsetX + ", " + this.prevPos.offsetY);
			// Add the position to the line array
			this.line = this.line.concat(positionData);
			this.paint(this.prevPos, offSetData, this.state.myStrokeStyle);
		}
	}
	endPaintEvent() {
		if (this.isPainting) {
			this.isPainting = false;
		}
	}
	paint(prevPos, currPos, strokeStyle) {
		const { offsetX, offsetY } = currPos;
		const { offsetX: x, offsetY: y } = prevPos;

		this.ctx.beginPath();
		this.ctx.strokeStyle = strokeStyle;
		// Move the the prevPosition of the mouse
		this.ctx.moveTo(x, y);
		// Draw a line to the current position of the mouse
		this.ctx.lineTo(offsetX, offsetY);
		// Visualize the line using the strokeStyle
		this.ctx.stroke();
		this.prevPos = { offsetX, offsetY };
	}
	onColorClick(e) {
	    //this.myStrokeStyle = window.getComputedStyle(e.target, null).getPropertyValue("background-color");
	    this.setState({
			myStrokeStyle: window.getComputedStyle(e.target, null).getPropertyValue("background-color"),
		})
	    console.log("oncolorclick");
	}



	saveImage() {
		const dataURL = this.canvas.toDataURL();
		//document.write('<img src="'+dataURL+'"/>');
		//this.saveBase64AsFile(dataURL, 'pic.png');
		var link = document.createElement("a");

		link.setAttribute("href", dataURL);
		link.setAttribute("download", 'pic.png');
		link.click();
	}

	componentDidMount() {
		// Here we set up the properties of the canvas element. 
		this.canvas.width = 700;
		this.canvas.height = 700;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		this.ctx.lineWidth = 5;
	}



	render() {
		const stylesObj = {
			backgroundColor: this.state.myStrokeStyle,
			borderRadius: '50%',
		};

		return (
			<div>
				<Helmet>
					<title>Paint 4 Me</title>
				</Helmet>
				<div>
					<Div style={stylesObj}></Div>
					<Div style={{backgroundColor: 'white'}} onClick={this.onColorClick}></Div>
					<Div style={{backgroundColor: 'red'}} onClick={this.onColorClick}></Div>
					<Div style={{backgroundColor: 'green'}} onClick={this.onColorClick}></Div>
					<Div style={{backgroundColor: 'yellow'}} onClick={this.onColorClick}></Div>
					<Div style={{backgroundColor: 'blue'}} onClick={this.onColorClick}></Div>
					<Div style={{backgroundColor: 'pink'}} onClick={this.onColorClick}></Div>
					<div onClick={this.onColorClick} style={{height: '20px', backgroundColor: 'black', color: 'white', display: 'inline-block'}}>eraser</div>
					<button id="myButton" download="YourFileName.jpg" style={{backgroundColor: 'lightgrey', marginBottom: '1%'}} onClick={this.saveImage}>Save Drawing</button>
				</div>
				<div>
					
				</div>
				<canvas
				// We use the ref attribute to get direct access to the canvas element. 
					ref={(ref) => (this.canvas = ref)}
					onMouseDown={this.onMouseDown}
					onMouseLeave={this.endPaintEvent}
					onMouseUp={this.endPaintEvent}
					onMouseMove={this.onMouseMove}
				/>
			</div>
		);
	}
}