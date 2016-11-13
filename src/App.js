import React, { Component } from 'react';
import './App.css';
import ee from 'event-emitter';

let store = {
  input: 0,
  memory: [],
  get curInput() {
  	return this.input;
  },
  
  get curMemories() {
    return this.memory.filter((m) => m !== undefined);
  },
  
  set commitMemory(input) {
    this.memory.push(input);
  },
  
  set newInput(str) {    
    let curInput = str,
      oldInput = this.curInput;
    
    if (this.curMemories.indexOf(oldInput) === -1) {
      this.commitMemory = oldInput;
    }
    
    this.input = curInput;
    ee.emitEvent('numberCruncher', [this.curInput]);
  }
};


class App extends React.Component {
  render() {
    return (
      	<main className="react-calculator">
			<Input />
			<Recall />
			<ButtonNumber />
			<ButtonFunction />
			<ButtonEquation />
		</main>
    );
  }	//render
}	//App

class Button extends React.Component {
	handleClick() {
		let text = this.props.text,
			cb = this.props.clickHandler;
		
		if (cb) {
			cb.call(null,text);
		}
	}	//handleClick
		
	render() {
		return (
			<button className={this.props.klass} onClick={this.handleClick}>
        		<span className="title">{this.props.text}</span>
      		</button>
		);
	}	// render
}	//Button

class Content extends React.Component {
	handleClick() {
		var cb = this.props.clickHandler;
		
		if (cb) {
			cb.call(this);
		}
	}	//handleClick
	
	render() {
		return (
			<div className="editable-field" contentEditable={this.props.initEdit} spellcheck={this.props.spellCheck} onClick={this.handleClick}>
				{this.props.text}
			</div>
		)
	}	//render	
}	//Content

class Input extends React.Component {
	updateField (data) {
		data = data.split ? data.split(' ').reverse().join(' ') : data;
		return this.setState({
			text: data
		});
	}	//updateField
		
	constructor(props) {
		super(props);
		this.props.text = this.props.text;
		this.state = {
			text: this.props.text
		};
	}	//constructor
		
	componentWillMount() {
    	ee.addListener('numberCruncher', this.updateField);
  	}	//componentWillMount
		
	render() {
		return (
			<Content text={this.state.text} initEdit='false' spellcheck='false' clickHandler={this.clickBait}/>
		)
	}	//render	
}	//Input

class Recall extends React.Component {
	toggleMemories() {
    	this.setState({show: !this.state.show});
  	}
  
  	recallMemory(memory) {
    	store.newInput = memory;
    	ee.emitEvent('toggle-memories');
  	}
  
  	constructor(props) {
		super(props);
		this.state = {
			show: false	
		};
  	}
  
  	componentWillMount() {
    	ee.addListener('toggle-memories', this.toggleMemories);
  	}
  
  	render() {
    	let classNames = `memory-bank ${this.state.show ? 'visible' : ''}`;
    
    return (
    	<section className={classNames}>
        	<Button text="+" clickHandler={this.toggleMemories} klass="toggle-close" />
        	{store.curMemories.map((mem) => {
          	return (
            	<Button klass="block memory transparent" text={mem} clickHandler={this.recallMemory} />
          	);
        })}
      </section>
    )
  }
}	//Recall

class ButtonFunction extends React.Component {
	showMemoryBank() {
    	ee.emitEvent('toggle-memories');
  	}
  
  	clear() {
    	store.newInput = 0;
  	}	//clear
  
  	contentClear() {
    	let curInput = String(store.curInput),
        	lessOne = curInput.substring(0, (curInput.length - 1));
    
    	return store.newInput = lessOne === '' ? 0 : lessOne;
  	}	//contentClear
  
  	render() {
    	return (
      		<section className="button-set--functions">
        		<Button text="recall" clickHandler={this.showMemoryBank} />
        		<Button text="clear" clickHandler={this.clear} />
        		<Button text="&larr;" clickHandler={this.contentClear} />
      		</section>
    	)
  	}	//render
}	//ButtonFunction

class ButtonEquation extends React.Component {
	eq (type) {
    	store.newInput = `${store.curInput} ${type} `;
  	}	//eq	
  
  	equate() {
    	store.newInput = eval(store.curInput);
  	}	//equate
  
  	render() {
    	return (
      		<section className="button-set--equations">
        		<Button text="+" clickHandler={this.eq} />
        		<Button text="-" clickHandler={this.eq} />
        		<Button text="*" clickHandler={this.eq} />
        		<Button text="/" clickHandler={this.eq} />
        		<Button text="=" clickHandler={this.equate} />
      		</section>
    	)  
  	}	//render
}	//ButtonEquation

class ButtonNumber extends React.Component {
	number (num) {
		if (!store.curInput) {
			return store.newInput = num;
		}
		return store.newInput = `${store.curInput}${num}`;
	}	//numeber
	
	render() {
		return (
			<section className="button-set--numbers">
				<Button text="7" clickHandler={this.number} />
				<Button text="8" clickHandler={this.number} />
				<Button text="9" clickHandler={this.number} />
				<Button text="4" clickHandler={this.number} />
				<Button text="5" clickHandler={this.number} />
				<Button text="6" clickHandler={this.number} />
				<Button text="1" clickHandler={this.number} />
				<Button text="2" clickHandler={this.number} />
				<Button text="3" clickHandler={this.number} />
				<Button text="0" clickHandler={this.number} />
			</section>
		)
	}	//render
}	//ButtonNumber

export default App;