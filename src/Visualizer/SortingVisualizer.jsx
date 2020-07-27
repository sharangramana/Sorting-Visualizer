import React, { Component } from 'react'
import './SortingVisualizer.css'
import InsertionSort from '../Algorithms/InsertionSort'
import SelectionSort from '../Algorithms/SelectionSort'
import BubbleSort from '../Algorithms/BubbleSort'
import GetQuickSortAnimation from '../Algorithms/QuickSort' 


const NORMAL_COLOR = '#ffbb00';
const CHANGED_COLOR = '#51ff00';
const AFTER_CHANGE_COLOR = '#ff5733';
var abort = false;


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default class SortingVisualizer extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrayToSort: [],
            prevChanged: [],
            numberOfItems: 100,
            delay: 10
        };
    }

    componentDidMount(){
        this.resetArray();
    }

    resetArray(){
        const arrayToSort = [];
        const prevChanged = [];
        for (let i = 0; i < this.state.numberOfItems; i++) {
            arrayToSort.push(this.RandomIntBetweenRange(5, 750));
        }
        this.setState({ arrayToSort, prevChanged });
        abort = false;
    }
    
    generateNewArray(){
        abort = true;
        this.resetArray();
    }

    async SortArray(algo){
        
        let sortedArrayAnim = algo(this.state.arrayToSort);
        let arrayToSort = this.state.arrayToSort;
        let prevChanged = this.state.prevChanged;

        for (let index = 0; index < sortedArrayAnim.length; index++) {
            if(this.abort){
                console.log(abort);
                return null;
            }
            const [i,j] = sortedArrayAnim[index];

            let temp = arrayToSort[i];
            arrayToSort[i] = arrayToSort[j];
            arrayToSort[j] = temp;
        
            prevChanged.push(i,j);

            if(index === sortedArrayAnim.length - 1){
                prevChanged.push(arrayToSort.length + 1, arrayToSort.length + 1);
                this.setState({prevChanged});
            }

            this.setState({ arrayToSort,prevChanged });
            await sleep(this.state.delay);
        }
    }

    async selectionSort(){
        let sortedArrayAnim = SelectionSort(this.state.arrayToSort);
        let arrayToSort = this.state.arrayToSort;
        let prevChanged = this.state.prevChanged;

        //loop through all the animations
        for (let index = 0; index < sortedArrayAnim.length; index++) {
            const [i,j, swap] = sortedArrayAnim[index];

            //change array
            if(swap){
                let temp = arrayToSort[i];
                arrayToSort[i] = arrayToSort[j];
                arrayToSort[j] = temp;
            }
        
            prevChanged.push(i,j);

            if(index === sortedArrayAnim.length - 1){
                prevChanged.push(arrayToSort.length + 1, arrayToSort.length + 1);
                this.setState({prevChanged});
            }

            this.setState({ arrayToSort, prevChanged });
                
            await sleep(this.state.delay);
        }
    }

    handleItemsInputOnChange(event){
        event.persist();
        this.setState({numberOfItems : event.target.value}, () => {
            this.resetArray();
            console.log(event.target.value + " - " + this.state.numberOfItems + " - arraySize: " + this.state.arrayToSort.length);
        });
        
    }

    handleDelayInputOnChange(event){
        this.setState({delay : event.target.value});
        
    }

    getColor(index){

        let prevChanged = this.state.prevChanged;

        if(prevChanged.includes(index)){
            if(index === prevChanged[prevChanged.length - 1] || index === prevChanged[prevChanged.length - 2]){
                return CHANGED_COLOR;
            }
            else{
                return AFTER_CHANGE_COLOR;
            }
        }
        else{
            return NORMAL_COLOR;
        }
        
    }


    render() {
        const {arrayToSort} = this.state;
        let widthValue = 40 / this.state.numberOfItems;
        return (
            <div>
                <div className="navclass">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg navbar-light shadow p-3 mb-5 rounded">
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <button onClick={() => this.generateNewArray()} className="btn my-2 my-sm-0" aria-disabled="true">
                                            <h6 className="text-text">Generate new array</h6>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => this.SortArray(BubbleSort)} className="btn my-2 my-sm-0" aria-disabled="true">
                                            <h6 className="text-text">Bubble Sort </h6>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => this.SortArray(InsertionSort)} className="btn my-2 my-sm-0 " aria-disabled="true">
                                            <h6 className="text-text">Insertion Sort</h6>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => this.selectionSort()} className="btn my-2 my-sm-0" aria-disabled="true">
                                            <h6 className="text-text">Selection Sort</h6>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => this.SortArray(GetQuickSortAnimation)} className="btn my-2 my-sm-0" aria-disabled="true">
                                            <h6 className="text-text">Quick Sort</h6>
                                        </button>
                                    </li>
                                    
                                </ul>
                            </div>
                        </nav>
                        
                        <div className="container-fluid" id="itemsDiv">
                            <div className="row">
                                <div className="col">
                                    <div class="sidebar navbar-light rounded">
                                        <div className="centerdivKeepWidth">
                                            <h6 className="numberLabel">Number of Items: </h6>
                                            <input className="numberInput" type="number" min="5" max="1500" onChange={(event) => this.handleItemsInputOnChange(event)} defaultValue={this.state.numberOfItems}/>
                                        </div>
                                        <div className="centerdivKeepWidth">
                                            <h6 className="numberLabel">Delay: </h6>
                                            <input className="numberInput" type="number" min="1" max="100" onChange={(event) => this.handleDelayInputOnChange(event)} defaultValue={this.state.delay}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8 shadow p-3 mb-5 rounded">
                                    {arrayToSort.map((heightValue, idx) => (
                                        <div className="array-item" key={idx} style={{height: `${(heightValue) / 25}vw`, width: `${widthValue}vw`, backgroundColor: this.getColor(idx)}}></div>
                                    ))}
                                </div>
                                <div className="col"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    RandomIntBetweenRange(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

