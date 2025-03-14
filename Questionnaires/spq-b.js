/// this is the SPQ B with two attention checks and subscale calculations  -z
let participantID = null;
jatos.onLoad(() => {
   console.log('Session Data:', jatos.sessionData);
   participantID = jatos.studySessionData?.participantID || 'test';
   if (participantID !== 'test') {
      console.log('Participant ID from session data:', participantID);
   } else {
      console.warn(
         'Session data or Participant ID is not set. Using fallback ID:',
         participantID
      );
   }
});

const startTime = performance.now();
let answers = {};

const questions = [
   {
      id: 1,
      text: 'Have you ever had the sense that some person or force is around you, even though you cannot see anyone?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 2,
      text: 'Are you sometimes sure that other people can tell what you are thinking?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 3,
      text: 'Have you ever noticed a common event or object that seemed to be a special sign for you?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 4,
      text: 'Do you often pick up hidden threats or put-downs from what people say or do?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 5,
      text: 'When shopping do you get the feeling that other people are taking notice of you?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 6,
      text: 'Have you had experiences with astrology, seeing the future, UFOs, ESP, or a sixth sense?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 7,
      text: 'Do you ever suddenly feel distracted by distant sounds that you are not normally aware of?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 8,
      text: 'Do you often have to keep an eye out to stop people from taking advantage of you?',
      factor: 'Cognitive-Perceptual',
   },
   {
      id: 9,
      text: 'People sometimes find me aloof and distant.',
      factor: 'Interpersonal',
   },
   {
      id: 10,
      text: 'I feel I have to be on my guard even with friends.',
      factor: 'Interpersonal',
   },
   {
      id: 11,
      text: 'I feel very uncomfortable in social situations involving unfamiliar people.',
      factor: 'Interpersonal',
   },
   {
      id: 12,
      text: 'Have you found that it is best not to let other people know too much about you?',
      factor: 'Interpersonal',
   },
   {
      id: 13,
      text: 'I tend to keep in the background on social occasions.',
      factor: 'Interpersonal',
   },
   {
      id: 14,
      text: 'Do you feel that you are unable to get "close" to people?',
      factor: 'Interpersonal',
   },
   {
      id: 15,
      text: 'I feel very uneasy talking to people I do not know well.',
      factor: 'Interpersonal',
   },
   {
      id: 16,
      text: 'I tend to keep my feelings to myself.',
      factor: 'Interpersonal',
   },
   {
      id: 17,
      text: 'People sometimes comment on my unusual mannerisms and habits.',
      factor: 'Disorganized',
   },
   {
      id: 18,
      text: 'Some people think that I am a very bizarre person.',
      factor: 'Disorganized',
   },
   {
      id: 19,
      text: 'Some people find me a bit vague and elusive during a conversation.',
      factor: 'Disorganized',
   },
   {
      id: 20,
      text: 'I sometimes use words in unusual ways.',
      factor: 'Disorganized',
   },
   { id: 21, text: 'I am an odd, unusual person.', factor: 'Disorganized' },
   {
      id: 22,
      text: 'I find it hard to communicate clearly what I want to say to people.',
      factor: 'Disorganized',
   },
];

const options = [
   { value: 'yes', label: 'Yes' },
   { value: 'no', label: 'No' },
];

const attentionChecks = [
   {
      id: 'AC1',
      text: 'This is an attention check, please select Yes to continue.',
      correct: 'yes',
   },
   {
      id: 'AC2',
      text: 'This is an attention check, please select No to continue.',
      correct: 'no',
   },
];

const scoreMapping = {
   yes: 1,
   no: 0,
};

const questionsPerPage = 1;
let currentPage = 0;
const totalPages = Math.ceil(
   (questions.length + attentionChecks.length) / questionsPerPage
);

let remainingTime = 0;
let pageTimerInterval = null;

function scrollToTop() {
   window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(pageIndex) {
   // Clear any existing timer
   if (pageTimerInterval) {
      clearInterval(pageTimerInterval);
      pageTimerInterval = null;
   }

   document
      .querySelectorAll('.page')
      .forEach((page) => page.classList.remove('active'));
   const currentPageDiv = document.getElementById(`page${pageIndex + 1}`);
   currentPageDiv.classList.add('active');
   currentPage = pageIndex;
   scrollToTop();

   // Start the timer for this page
   remainingTime = currentPageDiv.timerDuration;
   const nextBtn = currentPageDiv.nextBtn;

   // Update the Next button label
   updateNextButtonStateForTimer(nextBtn);

   pageTimerInterval = setInterval(() => {
      remainingTime--;
      updateNextButtonStateForTimer(nextBtn);

      if (remainingTime <= 0) {
         clearInterval(pageTimerInterval);
         pageTimerInterval = null;
         // Enable the Next button if all questions are answered
         updateNextButtonStateForTimer(nextBtn);
      }
   }, 1000);
}

function updateNextButtonStateForTimer(nextBtn) {
   const startIndex = currentPage * questionsPerPage;
   const endIndex = startIndex + questionsPerPage;

   const allAnswered = areAllQuestionsAnswered(startIndex, endIndex);

   if (remainingTime > 0) {
      nextBtn.disabled = true;
      nextBtn.textContent =
         currentPage < totalPages - 1
            ? `Next (${remainingTime})`
            : `Submit (${remainingTime})`;
   } else {
      nextBtn.textContent = currentPage < totalPages - 1 ? 'Next' : 'Submit';
   }
   nextBtn.disabled = remainingTime > 0 || !allAnswered;
}

function insertAttentionChecks() {
   const questionsCopy = [...questions]; // Clone the original questions
   const shuffledAttentionChecks = [...attentionChecks].sort(
      () => Math.random() - 0.5
   ); // Shuffle attention checks

   // Define the range where attention checks can be inserted (after the 3rd question)
   const insertableRangeStart = 3; // Zero-based index
   const insertableRangeEnd = questionsCopy.length;

   // Randomly insert each attention check
   shuffledAttentionChecks.forEach((check) => {
      const randomIndex =
         Math.floor(
            Math.random() * (insertableRangeEnd - insertableRangeStart)
         ) + insertableRangeStart;
      questionsCopy.splice(randomIndex, 0, check); // Insert attention check
   });

   console.log('Final Questions with Attention Checks:', questionsCopy);
   return questionsCopy;
}

const randomizedQuestions = insertAttentionChecks();

function createQuestionPages() {
   const container = document.getElementById('questionnaire-container');
   const timerDuration = 5; // Timer duration in seconds

   for (let i = 0; i < totalPages; i++) {
      const pageDiv = document.createElement('div');
      pageDiv.classList.add('page');
      if (i === 0) pageDiv.classList.add('active');
      pageDiv.id = `page${i + 1}`;

      const start = i * questionsPerPage;
      const end = start + questionsPerPage;
      const pageQuestions = randomizedQuestions.slice(start, end);

      pageQuestions.forEach((question) => {
         const questionContainer = document.createElement('div');
         questionContainer.classList.add('question-container');

         const questionDiv = document.createElement('div');
         questionDiv.classList.add('question');
         questionDiv.innerHTML = `${question.text}`;
         questionContainer.appendChild(questionDiv);

         const buttonGroup = document.createElement('div');
         buttonGroup.classList.add('button-group');
         options.forEach((option) => {
            const button = document.createElement('button');
            button.classList.add('btn-option');
            button.textContent = option.label;
            button.onclick = () => {
               selectAnswer(question.id, option.value, button); // Save the answer
               // TODO: updateNextButtonState not defined
               // updateNextButtonState(start, end, nextBtn); // Check if "Next" can be enabled
            };
            buttonGroup.appendChild(button);
         });
         questionContainer.appendChild(buttonGroup);
         pageDiv.appendChild(questionContainer);
      });

      const navDiv = document.createElement('div');
      navDiv.classList.add('navigation');

      // Placeholder for the Previous Button (to maintain alignment)
      const prevPlaceholder = document.createElement('div');
      prevPlaceholder.classList.add('btn-placeholder');
      navDiv.appendChild(prevPlaceholder);

      // Create Next Button
      const nextBtn = document.createElement('button');
      nextBtn.classList.add('btn');
      nextBtn.textContent =
         i < totalPages - 1
            ? `Next (${timerDuration})`
            : `Submit (${timerDuration})`;
      nextBtn.disabled = true; // Disable by default
      nextBtn.onclick = () => {
         if (i < totalPages - 1) {
            showPage(i + 1);
         } else {
            submitData(); // Directly submit data when "Submit" is clicked
         }
      };

      pageDiv.nextBtn = nextBtn; // Store the Next button in the pageDiv
      pageDiv.timerDuration = timerDuration; // Store timer duration

      navDiv.appendChild(nextBtn);
      pageDiv.appendChild(navDiv);
      container.appendChild(pageDiv);
   }
}

function areAllQuestionsAnswered(startIndex, endIndex) {
   for (let i = startIndex; i < endIndex; i++) {
      const questionId = randomizedQuestions[i].id;
      if (!answers[questionId]) {
         return false;
      }
   }
   return true;
}

function selectAnswer(questionId, value, selectedButton) {
   answers[questionId] = value;
   console.log('Selected Question ID:', questionId, 'Value:', value);

   const buttonGroup = selectedButton.parentNode;
   buttonGroup.querySelectorAll('button').forEach((button) => {
      button.classList.remove('pressed');
   });
   selectedButton.classList.add('pressed');

   const questionContainer = selectedButton.closest('.question-container');
   questionContainer.classList.add('answered');

   // Update Next button state
   const currentPageDiv = document.getElementById(`page${currentPage + 1}`);
   const nextBtn = currentPageDiv.nextBtn;
   updateNextButtonStateForTimer(nextBtn);
}

function submitData() {
   const endTime = performance.now();
   const timeTaken = (endTime - startTime) / 1000;
   const data = {};
   data['participant_id'] = participantID;
   let totalScore = 0;
   const factorScores = {
      'Cognitive-Perceptual': 0,
      Interpersonal: 0,
      Disorganized: 0,
   };
   let unansweredQuestions = [];
   let attentionFails = 0;

   // Check for unanswered questions first
   randomizedQuestions.forEach((question) => {
      const selectedOption = answers[question.id];
      if (!selectedOption) {
         unansweredQuestions.push(question.id);
      }
   });

   if (unansweredQuestions.length > 0) {
      alert(
         `Please answer all questions before submitting. Unanswered questions: ${unansweredQuestions.join(
            ', '
         )}`
      );
      const firstUnansweredPage = Math.floor(
         randomizedQuestions.findIndex((q) => q.id === unansweredQuestions[0]) /
            questionsPerPage
      );
      showPage(firstUnansweredPage);
      return;
   }

   // Process regular questions
   randomizedQuestions.forEach((question) => {
      const selectedOption = answers[question.id];

      if (attentionChecks.some((check) => check.id === question.id)) {
         // Process attention checks
         const attentionCheck = attentionChecks.find(
            (check) => check.id === question.id
         );
         const attentionPassed = selectedOption === attentionCheck.correct;

         if (!attentionPassed) {
            attentionFails++;
         }

         data[`attention_check_${question.id.toLowerCase()}`] = {
            answer: selectedOption,
            attention_failed: !attentionPassed,
         };
      } else {
         // Process SPQ items
         const score = scoreMapping[selectedOption];
         totalScore += score;

         if (question.factor) {
            factorScores[question.factor] += score;
         }

         data[`spq_q${question.id}`] = {
            answer: selectedOption,
            score: score,
         };
      }
   });

   // Add summary statistics
   data['spq_total_score'] = totalScore;
   data['spq_cognitive_perceptual'] = factorScores['Cognitive-Perceptual'];
   data['spq_interpersonal'] = factorScores['Interpersonal'];
   data['spq_disorganized'] = factorScores['Disorganized'];
   data['spq_attention_fails'] = attentionFails;
   data['spqb_time'] = timeTaken;

   console.log('Submitting data:', JSON.stringify(data));
   jatos
      .submitResultData(JSON.stringify(data))
      .then(() => {
         console.log('Data submitted successfully');
         jatos.startNextComponent();
      })
      .catch((error) => {
         console.error('Submission error:', error);
      });
}

createQuestionPages();
showPage(0);
