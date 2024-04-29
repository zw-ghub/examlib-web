const { createApp } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const app = createApp({
	data(){
		let libs = EXAM_LIBS;
		return {
			drawer: false,
			libs,
			currLib: null,
			title: '',
			questionAll: [],
			currQuestion: null,
			currIndex: 0,
			currSelected: null,
			showAnswer: false,
			dialogContinue: false,
			localData: null,
		};
	},
	methods: {
		init(){
			// check local
			let localData = this.loadLocalData();
			if (localData && localData.libId) {
				this.localData = localData;
				for (let i=0; i<this.libs.length; i++) {
					let lib = this.libs[i];
					if (lib.id == localData.libId) {
						this.changeLib(i);
						if (localData.currIndex > 0 && localData.currIndex < this.questionAll.length) {
							this.dialogContinue = true;
						}
						break;
					}
				}
			}else{
				this.changeLib(0);
			}
		},
		changeLib(index){
			if (this.currLib &&  this.currLib.id == this.libs[index].id) return;
			let currLib = this.libs[index];
			this.currLib = currLib;
			this.title = currLib.title;
			this.questionAll = currLib.questions;
			this.currIndex = 0;
			this.changeQuestion();
			this.drawer = false;
			this.saveToLocal();
		},
		changeQuestion(){
			this.currQuestion = this.questionAll[this.currIndex];
			// 切换题目初始化一些数据
			if (this.currQuestion.type == 2) {
				this.currSelected = [];
			} else {
				this.currSelected = null;
			}
			this.showAnswer = false;
			this.saveToLocal();
		},
		next(){
			// 多选检查
			if (this.currQuestion.type == 2) {
				if (this.checkAnswer()) {
					this.showAnswer = false;
				} else {
					this.showAnswer = true;
					return;
				}
			}
			if (this.currIndex >= this.questionAll.length-1) {
				alert('已是最后一题');
				return;
			}
			this.currIndex++;
			this.changeQuestion();
		},
		prev(){
			if (this.currIndex < 1) {
				return;
			}
			this.currIndex--;
			this.changeQuestion();
		},
		indexToLetter(index){
			return index < LETTERS.length ? LETTERS[index] : 'X';
		},
		checkAnswer(){
			if (this.currQuestion.type == 2) {
				// 多选
				let str = this.currSelected.sort().join('');
				console.log(str);
				return str == this.currQuestion.answer;
			} else {
				return this.currSelected == this.currQuestion.answer;
			}
		},
		handleSelect(){
			if(this.currQuestion.type == 2) return;
			if (this.checkAnswer()) {
				// 答对下一题
				this.showAnswer = false;
				setTimeout(this.next, 500);
			} else {
				this.showAnswer = true;
			}
		},
		saveToLocal(){
			let data = {
				libId: this.currLib.id,
				currIndex: this.currIndex
			};
			localStorage.setItem('examlib', JSON.stringify(data));
		},
		loadLocalData(){
			let json = localStorage.getItem('examlib');
			if (json) {
				return JSON.parse(json);
			}
			return null;
		},
		toLocalCurr(){
			this.dialogContinue = false;
			if (this.localData) {
				this.currIndex = this.localData.currIndex;
				this.changeQuestion();
			}
		}
	},
	created(){
		this.init();
	},
	watch: {
		currSelected(newVal){
			if (newVal == null) return;
			this.handleSelect();
		}
	}
});

app.use(vuetify).mount('#app');
