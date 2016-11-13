var React = require('react');
var ee = require('event-emitter');

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


const App = React.createClass({  
  render: function() {    
    return (
      <main className="react-calculator">
        <InputField />
        <TotalRecall />
        <ButtonSetNumbers />
        <ButtonSetFunctions />
        <ButtonSetEquations />      
      </main>
    )
  }
});


const Button = React.createClass({
  _handleClick: function() {
    let text = this.props.text,
        cb = this.props.clickHandler;
    
    if (cb) {
      cb.call(null, text);
    }
  },
  
  render: function() {
    return (
      <button className={this.props.klass} onClick={this._handleClick}>
        <span className="title">{this.props.text}</span>
      </button>
    );
  }
});
const ContentEditable = React.createClass({
  _handleClick: function() {
    const cb = this.props.clickHandler;

    if (cb) {
      cb.call(this);
    }
  },
  
  render: function() {
    return (
      <div className="editable-field" contentEditable={this.props.initEdit} spellcheck={this.props.spellCheck} onClick={this._handleClick}>
        {this.props.text}
      </div>
    )
  }
});

const InputField = React.createClass({
  _updateField: function (newStr) {
    newStr = newStr.split ? newStr.split(' ').reverse().join(' ') : newStr;
    return this.setState({text: newStr});
  },
  
  getInitialState: function() {
    this.props.text = this.props.text || '0';
    
    return {text: this.props.text};
  },
  
  componentWillMount: function() {
    ee.addListener('numberCruncher', this._updateField);
  },
  
  render: function() {    
    return <ContentEditable text={this.state.text} initEdit="false" spellcheck="false" clickHandler={this._clickBait} />
  }
});
const TotalRecall = React.createClass({
  _toggleMemories: function() {
    this.setState({show: !this.state.show});
  },
  
  _recallMemory: function(memory) {
    store.newInput = memory;
    ee.emitEvent('toggle-memories');
  },
  
  getInitialState: function() {
    return {show: false}
  },
  
  componentWillMount: function() {
    ee.addListener('toggle-memories', this._toggleMemories);
  },
  
  render: function() {
    let classNames = `memory-bank ${this.state.show ? 'visible' : ''}`;
    
    return (
      <section className={classNames}>
        <Button text="+" clickHandler={this._toggleMemories} klass="toggle-close" />
        {store.curMemories.map((mem) => {
          return (
            <Button klass="block memory transparent" text={mem} clickHandler={this._recallMemory} />
          );
        })}
      </section>
    )
  }
});

const ButtonSetFunctions = React.createClass({
  _showMemoryBank: function() {
    ee.emitEvent('toggle-memories');
  },
  
  _clear: function() {
    store.newInput = 0;
  },
  
  _contentClear: function() {
    let curInput = String(store.curInput),
        lessOne = curInput.substring(0, (curInput.length - 1));
    
    return store.newInput = lessOne === '' ? 0 : lessOne;
  },
  
  render: function() {
    return (
      <section className="button-set--functions">
        <Button text="recall" clickHandler={this._showMemoryBank} />
        <Button text="clear" clickHandler={this._clear} />
        <Button text="&larr;" clickHandler={this._contentClear} />
      </section>
    )
  }
});
const ButtonSetEquations = React.createClass({
  _eq: function(type) {
    store.newInput = `${store.curInput} ${type} `;
  },
  
  _equate: function() {
    store.newInput = eval(store.curInput);
  },
  
  render: function() {
    return (
      <section className="button-set--equations">
        <Button text="+" clickHandler={this._eq} />
        <Button text="-" clickHandler={this._eq} />
        <Button text="*" clickHandler={this._eq} />
        <Button text="/" clickHandler={this._eq} />
        <Button text="=" clickHandler={this._equate} />
      </section>
    )  
  }
});

const ButtonSetNumbers = React.createClass({
  _number: function(num) {
    if (!store.curInput) {
      return store.newInput = num;
    }
    
    return store.newInput = `${store.curInput}${num}`;
  },
  
  render: function() {
    return (
      <section className="button-set--numbers">
        <Button text="1" clickHandler={this._number} />
        <Button text="2" clickHandler={this._number} />
        <Button text="3" clickHandler={this._number} />
        <Button text="4" clickHandler={this._number} />
        <Button text="5" clickHandler={this._number} />
        <Button text="6" clickHandler={this._number} />
        <Button text="7" clickHandler={this._number} />
        <Button text="8" clickHandler={this._number} />
        <Button text="9" clickHandler={this._number} />
        <Button text="0" clickHandler={this._number} />
      </section>
    )
  }
});