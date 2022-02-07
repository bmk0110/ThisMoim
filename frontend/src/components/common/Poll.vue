<template>
  <div class="Poll MoveableBox">
    <div class="poll-container" v-if="!isSetAll & !isEnd ">
      <div>
        <div class="poll-title" >
          <strong>Q. </strong> <input v-model="poll.question" type="text" placeholder="Your Question..." />
          <hr />
        </div>
        <div class="poll-content">
          <div
            v-for="(answer, index) in poll.answers"
            :key="index"
            class="answer"
            :style="{zIndex: poll.answers.length - index}"
          >
          
            <div class="d-flex">
              <input
                :placeholder="'Answer ' + (index + 1)"
                v-model="poll.answers[index].answer"
                type="text"
              />
              <div class="d-flex" @click="deleteInput(index)">
                <v-icon>mdi-minus-circle-outline</v-icon>
                <h3>삭제</h3>
              </div>
            </div>
          </div>
          <v-btn class="d-flex" @click="createNewInput()">
            <v-icon>mdi-plus-circle-outline</v-icon>
            <h3>항목 추가</h3>
          </v-btn><hr>
        </div>
        <div class="poll-footer">
          <v-btn @click="reset">리셋</v-btn>
          <v-btn @click="save">저장</v-btn>
        </div>
      </div>
    </div>

    <div class="poll-container" v-if="isSetAll & !isEnd">
      <div>
        <div class="poll-title">
          <strong>Q. </strong> <input readonly="readonly" v-model="poll.question" type="text" placeholder="Your Question..." />
          <hr />
        </div>
        <div class="poll-content">

          <v-radio-group v-model="voted" v-if="!didYou">
            <v-radio
              v-for="(answer, index) in poll.answers"
              :key="index"
              :label="`${answer.answer}`"
              :value="index"
            ></v-radio>
          </v-radio-group>  

          <v-radio-group v-model="voted" v-if="didYou">
            <v-radio
              v-for="(answer, index) in poll.answers"
              :key="index"
              :label="`${answer.answer}`"
              :value="index"
              :disabled=true
            ></v-radio>
          </v-radio-group>  

          <hr>
        </div>
        <div class="poll-footer">
          <v-btn @click="vote">투표</v-btn>
          <v-btn @click="end">투표종료</v-btn>
        </div>
      </div>
    </div>


    <div class="poll-container" v-if="isSetAll & isEnd">
      <div>
        <div class="poll-title">
          <strong>Q. </strong> <input readonly="readonly" v-model="poll.question" type="text" placeholder="Your Question..." />
          <hr />
        </div>
        <div class="poll-content">
          <div
            v-for="(answer, index) in poll.answers"
            :key="index"
            class="answer"
            :style="{zIndex: poll.answers.length - index}"
          >
            <div>
              {{ answer.answer }}
              {{ answer.voted }}
            </div>
          </div>
        </div><hr>
        <div class="poll-footer">
          <h3 v-if="result.length == 0">No Result</h3>

          <h3 v-else> 
            <strong>A. </strong> 
            <h3 v-for="(answer, index) in result" 
            :key="index">
              <strong>{{answer.answer}} </strong>
            </h3>
          </h3>
          
        </div>
      </div>
    </div> 
    
    
    <!-- <div>
      {{ this.poll }}
      {{ this.result }}
    </div><br><br> -->
  </div>
</template>

<script>
export default {
  props:{
    
  },
  data() {
    return {
      poll: {
        question: "프론트 팀장은 누가 좋을까요?",
        answers: [ {answer: "김강현", voted: 0}, {answer: "배민규", voted: 0}, {answer: "정용우 the Master of Frontend", voted: 0}],
        multipleVotes: false,
        totalVotes: 0,
        userVoted: [ ],
      },
      isSetAll: false,
      isEnd: false,
      test: [],
      voted: '',
      didYou: false,
      result: [],
    };
  },
  create:{
    // isUserAlreadyVoted: function(){
    //   let my = this.$store.state.email;
    //   if(this.poll.userVoted.length == 0) {
    //   console.log("no vote yet !")
    //   // return true;
    //   }
    //   for( var userVoteData in this.poll.userVoted){
    //     if(userVoteData.user == my){
    //       // return false;
    //       console.log("you already voted!")
    //     }
    //   }
    //   // return true;
    //   console.log("you have to vote !")
    // }
  },
  computed:{
    
  },
  watch:{
  },
  methods: {
    createNewInput() {
      this.poll.answers.push({answer: "", voted: 0});
    },
    deleteInput(index) {
      if (index > 0 || this.poll.answers.length > 1) {
        this.poll.answers.splice(index, 1);
      }
    },
    reset() {
      this.poll = {
        question: "",
        answers: [{answer:"", voted: 0}],
        multipleVotes: false,
      }
    },
    save() {
      //서버로 보내서 투표 저장
      this.isSetAll = true;
    },
    vote() {
      if(this.didYou) {return;}
      this.poll.answers[this.voted].voted++;
      this.poll.userVoted.push({user: this.$store.state.email, voted:this.voted});
      // console.log(this.$store.state.email);
      this.didYou = true;
    },
    end(){
      this.isEnd = true;
      let base = 0;
      let list = this.poll.answers

      for(var i=0; i<list.length; i++) {
        if(list[i].voted > base) {
          base = list[i].voted;
          this.result.push(list[i]); 
        }
      }
    },
  },
};
</script>

<style scoped>

.Poll{
  display: inline-block;
  position: relative;
  padding: 1%;
}
.poll-container {
  width: 500px;
  border: 2px solid gray;
  border-radius: 5px;
  font-size: 20px;
  padding: 1%;
}


.form-check-input {
  width: 20px;
  height: 20px;
  color: black;
}

.poll-title{
  font-size: 30px;
  padding: 1%;
}

/* .poll-content{
} */

.poll-footer {
  text-align: center;
}

.poll-footer > button{
  /* margin-left: 5%;
  margin-right: 5%; */
  margin: 2% 10%;
}

h3{
  display: inline;
}
</style>