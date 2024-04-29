const { createApp } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const app = createApp({
	data(){
		return {
			title: EXAM_DATA.title,
			questionAll: EXAM_DATA.questions,
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
			this.currQuestion = this.questionAll[0];
			// check local
			let localData = this.loadLocalData();
			if (localData && localData.libId == EXAM_DATA.id) {
				if (localData.currIndex > 0 && localData.currIndex < this.questionAll.length) {
					this.localData = localData;
					this.dialogContinue = true;
				}
			}
		},
		next(){
			if (this.currIndex >= this.questionAll.length-1) {
				alert('已是最后一题');
				return;
			}
			this.currIndex++;
			this.currQuestion = this.questionAll[this.currIndex];
		},
		prev(){
			if (this.currIndex < 1) {
				return;
			}
			this.currIndex--;
			this.currQuestion = this.questionAll[this.currIndex];
		},
		indexToLetter(index){
			return index < LETTERS.length ? LETTERS[index] : 'X';
		},
		handleSelect(){
			if (this.currSelected == this.currQuestion.answer) {
				// 答对下一题
				this.showAnswer = false;
				setTimeout(this.next, 500);
			} else {
				this.showAnswer = true;
			}
		},
		saveToLocal(){
			let data = {
				libId: EXAM_DATA.id,
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
				this.currQuestion = this.questionAll[this.currIndex];
			}
		}
	},
	created(){
		this.init();
	},
	watch: {
		currIndex(){
			// 切换题目初始化一些数据
			this.currSelected = null;
			this.showAnswer = false;
			this.saveToLocal();
		},
		currSelected(newVal){
			if (newVal == null) return;
			this.handleSelect();
		}
	}
});

app.use(vuetify).mount('#app');
