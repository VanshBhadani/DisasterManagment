/**
 * Suraksha Learn - Quiz Logic
 * Handles quizzes with PDF certificate generation
 */

// Utility function for screen reader announcements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

class DisasterQuiz {
  constructor() {
    this.currentModule = this.getModuleFromURL() || 'earthquake';
    this.currentQuestion = 0;
    this.answers = [];
    this.score = 0;
    this.maxScore = 0;
    this.timeLimit = 300; // 5 minutes default
    this.timeRemaining = this.timeLimit;
    this.isStarted = false;
    this.isCompleted = false;
    this.timerInterval = null;
    this.studentInfo = {};
    
    // DOM elements
    this.startScreen = document.getElementById('quizStart');
    this.quizScreen = document.getElementById('quizQuestions');
    this.resultsScreen = document.getElementById('quizResults');
    this.certificatePreview = document.getElementById('certificatePreview');
    
    this.questionCounter = document.getElementById('questionCounter');
    this.timerDisplay = document.getElementById('timeRemaining');
    this.questionText = document.getElementById('questionText');
    this.questionImage = document.getElementById('questionImage');
    this.answersContainer = document.getElementById('answersContainer');
    this.nextBtn = document.getElementById('nextQuestion');
    this.prevBtn = document.getElementById('prevQuestion');
    
    this.finalScore = document.getElementById('finalScore');
    this.passingStatus = document.getElementById('passingStatus');
    this.scoreDetails = document.getElementById('scoreDetails');
    
    // Quiz data
    this.quizData = this.getQuizData();
    this.maxScore = this.quizData.questions.length * 10; // 10 points per question
    this.timeLimit = this.quizData.timeLimit;
    this.timeRemaining = this.timeLimit;
    
    this.init();
  }
  
  /**
   * Initialize quiz
   */
  init() {
    console.log(`📝 Initializing ${this.currentModule} quiz`);
    
    this.setupEventListeners();
    this.showStartScreen();
    this.loadQuizProgress();
  }
  
  /**
   * Get module type from URL parameters
   */
  getModuleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('module') || 'earthquake';
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Start quiz button
    const startBtn = document.getElementById('startQuiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.collectStudentInfo();
      });
    }
    
    // Navigation buttons
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }
    
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.previousQuestion();
      });
    }

    // Submit quiz button
    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitQuiz();
      });
    }

    // Results actions
    const retryBtn = document.getElementById('retryQuiz');
    const certificateBtn = document.getElementById('downloadCertificate');
    const viewCertBtn = document.getElementById('viewCertificate');
    
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.retryQuiz();
      });
    }
    
    if (certificateBtn) {
      certificateBtn.addEventListener('click', () => {
        this.downloadCertificate();
      });
    }
    
    if (viewCertBtn) {
      viewCertBtn.addEventListener('click', () => {
        this.previewCertificate();
      });
    }
    
    // Certificate modal
    const certModal = document.getElementById('certificateModal');
    const closeCertModal = document.getElementById('closeCertificateModal');
    
    if (closeCertModal) {
      closeCertModal.addEventListener('click', () => {
        certModal.hidden = true;
      });
    }
    
    // Form validation
    this.setupFormValidation();
  }
  
  /**
   * Setup form validation for student info
   */
  setupFormValidation() {
    const form = document.getElementById('studentInfoForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startQuiz();
    });
  }
  
  /**
   * Validate individual form field
   */
  validateField(field) {
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
    }
    
    return isValid;
  }
  
  /**
   * Get quiz data for the current module
   */
  getQuizData() {
    const quizzes = {
      earthquake: {
        title: 'Earthquake Preparedness Quiz',
        description: 'Test your knowledge of earthquake safety and response procedures.',
        timeLimit: 300, // 5 minutes
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What is the first action you should take during an earthquake?',
            image: 'assets/quiz-earthquake-1.jpg',
            type: 'single',
            answers: [
              { id: 'a', text: 'Drop to the ground immediately', correct: true },
              { id: 'b', text: 'Run to the nearest exit', correct: false },
              { id: 'c', text: 'Stand in a doorway', correct: false },
              { id: 'd', text: 'Look for the source of shaking', correct: false }
            ],
            explanation: 'Drop, Cover, and Hold is the internationally recommended response. Dropping immediately protects you from falling objects.'
          },
          {
            id: 2,
            question: 'Where is the safest place to take cover during an earthquake in a classroom?',
            image: 'assets/quiz-earthquake-2.jpg',
            type: 'single',
            answers: [
              { id: 'a', text: 'Under a sturdy desk or table', correct: true },
              { id: 'b', text: 'In the center of the room', correct: false },
              { id: 'c', text: 'Near the windows', correct: false },
              { id: 'd', text: 'By the classroom door', correct: false }
            ],
            explanation: 'Sturdy furniture like desks provide the best protection from falling objects and debris.'
          },
          {
            id: 3,
            question: 'What should you do immediately after an earthquake stops?',
            image: 'assets/quiz-earthquake-3.jpg',
            type: 'single',
            answers: [
              { id: 'a', text: 'Stay covered and wait for aftershocks', correct: false },
              { id: 'b', text: 'Check for injuries and hazards, then evacuate if necessary', correct: true },
              { id: 'c', text: 'Run outside as fast as possible', correct: false },
              { id: 'd', text: 'Take photos of the damage', correct: false }
            ],
            explanation: 'Check for injuries and immediate hazards first, then evacuate calmly if the building is damaged.'
          },
          {
            id: 4,
            question: 'Which of these items should be in an earthquake emergency kit?',
            image: 'assets/quiz-earthquake-4.jpg',
            type: 'multiple',
            answers: [
              { id: 'a', text: 'Water (1 gallon per person per day)', correct: true },
              { id: 'b', text: 'Non-perishable food for 3 days', correct: true },
              { id: 'c', text: 'Candles for lighting', correct: false },
              { id: 'd', text: 'Battery-powered radio', correct: true }
            ],
            explanation: 'Water, food, and battery-powered communication devices are essential. Avoid candles due to fire risk.'
          },
          {
            id: 5,
            question: 'True or False: You should use elevators during an earthquake evacuation.',
            type: 'boolean',
            answers: [
              { id: 'true', text: 'True', correct: false },
              { id: 'false', text: 'False', correct: true }
            ],
            explanation: 'Never use elevators during earthquakes. They can malfunction or trap you between floors.'
          },
          {
            id: 6,
            question: 'What magnitude earthquake typically causes significant damage?',
            type: 'single',
            answers: [
              { id: 'a', text: '3.0 - 4.0', correct: false },
              { id: 'b', text: '5.0 - 5.9', correct: false },
              { id: 'c', text: '6.0 - 6.9', correct: true },
              { id: 'd', text: '8.0+', correct: false }
            ],
            explanation: 'Earthquakes of magnitude 6.0-6.9 can cause significant damage to buildings and infrastructure.'
          },
          {
            id: 7,
            question: 'How long should you expect aftershocks to continue after a major earthquake?',
            type: 'single',
            answers: [
              { id: 'a', text: 'A few hours', correct: false },
              { id: 'b', text: 'A few days', correct: false },
              { id: 'c', text: 'Weeks to months', correct: true },
              { id: 'd', text: 'They stop immediately', correct: false }
            ],
            explanation: 'Aftershocks can continue for weeks or months after a major earthquake, gradually decreasing in frequency.'
          }
        ]
      },
      
      fire: {
        title: 'Fire Safety Quiz',
        description: 'Test your knowledge of fire prevention, detection, and emergency response procedures.',
        timeLimit: 300, // 5 minutes
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What should you do first when you discover a fire?',
            image: 'assets/quiz-fire-1.jpg',
            type: 'single',
            answers: [
              { id: 'a', text: 'Try to put it out yourself', correct: false },
              { id: 'b', text: 'Alert others and call for help', correct: true },
              { id: 'c', text: 'Gather your belongings', correct: false },
              { id: 'd', text: 'Open windows for ventilation', correct: false }
            ],
            explanation: 'Alerting others and calling emergency services should always be your first priority.'
          },
          {
            id: 2,
            question: 'Why should you never use elevators during a fire emergency?',
            type: 'single',
            answers: [
              { id: 'a', text: 'They move too slowly', correct: false },
              { id: 'b', text: 'They may malfunction or trap you', correct: true },
              { id: 'c', text: 'They are reserved for firefighters', correct: false },
              { id: 'd', text: 'They consume too much power', correct: false }
            ],
            explanation: 'Elevators can malfunction due to heat, power loss, or smoke, trapping passengers between floors.'
          },
          {
            id: 3,
            question: 'If you encounter smoke while evacuating, you should:',
            type: 'single',
            answers: [
              { id: 'a', text: 'Stand tall and walk quickly', correct: false },
              { id: 'b', text: 'Crawl low under the smoke', correct: true },
              { id: 'c', text: 'Hold your breath and run', correct: false },
              { id: 'd', text: 'Turn back immediately', correct: false }
            ],
            explanation: 'Smoke rises, so cleaner air is found closer to the floor. Crawl low to avoid inhaling toxic gases.'
          },
          {
            id: 4,
            question: 'Which type of fire extinguisher should be used on electrical fires?',
            type: 'single',
            answers: [
              { id: 'a', text: 'Water (Class A)', correct: false },
              { id: 'b', text: 'Foam (Class B)', correct: false },
              { id: 'c', text: 'Carbon Dioxide (Class C)', correct: true },
              { id: 'd', text: 'Wet Chemical (Class K)', correct: false }
            ],
            explanation: 'Class C extinguishers contain non-conductive agents safe for use on electrical equipment.'
          },
          {
            id: 5,
            question: 'True or False: You should test smoke alarms monthly.',
            type: 'boolean',
            answers: [
              { id: 'true', text: 'True', correct: true },
              { id: 'false', text: 'False', correct: false }
            ],
            explanation: 'Smoke alarms should be tested monthly to ensure they function properly in an emergency.'
          },
          {
            id: 6,
            question: 'What is the recommended meeting place during a fire evacuation?',
            type: 'single',
            answers: [
              { id: 'a', text: 'The parking lot', correct: false },
              { id: 'b', text: 'A designated assembly point', correct: true },
              { id: 'c', text: 'Across the street', correct: false },
              { id: 'd', text: 'Your car', correct: false }
            ],
            explanation: 'Pre-designated assembly points help ensure everyone is accounted for and positioned safely.'
          }
        ]
      }
    };
    
    return quizzes[this.currentModule] || quizzes.earthquake;
  }
  
  /**
   * Show start screen
   */
  showStartScreen() {
    if (this.startScreen) {
      this.startScreen.hidden = false;
    }
    
    if (this.quizScreen) {
      this.quizScreen.hidden = true;
    }
    
    if (this.resultsScreen) {
      this.resultsScreen.hidden = true;
    }
    
    // Populate quiz info
    const quizTitle = document.getElementById('quizTitle');
    const quizDescription = document.getElementById('quizDescription');
    const questionCount = document.getElementById('questionCount');
    const timeLimit = document.getElementById('timeLimit');
    
    if (quizTitle) {
      quizTitle.textContent = this.quizData.title;
    }
    
    if (quizDescription) {
      quizDescription.textContent = this.quizData.description;
    }
    
    if (questionCount) {
      questionCount.textContent = this.quizData.questions.length;
    }
    
    if (timeLimit) {
      timeLimit.textContent = Math.floor(this.quizData.timeLimit / 60);
    }
  }
  
  /**
   * Collect student information before starting quiz
   */
  collectStudentInfo() {
    const form = document.getElementById('studentInfoForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required]');
    let allValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        allValid = false;
      }
    });
    
    if (!allValid) {
      announceToScreenReader('Please fill in all required fields correctly');
      return;
    }
    
    // Collect student info
    const studentName = document.getElementById('studentName')?.value || '';
    const studentId = document.getElementById('studentId')?.value || '';
    const institution = document.getElementById('institution')?.value || '';
    const course = document.getElementById('course')?.value || '';
    
    this.studentInfo = {
      name: studentName,
      id: studentId,
      institution: institution,
      course: course
    };
    
    this.startQuiz();
  }
  
  /**
   * Start the quiz
   */
  startQuiz() {
    this.isStarted = true;
    this.currentQuestion = 0;
    this.answers = new Array(this.quizData.questions.length);
    this.score = 0;
    this.timeRemaining = this.timeLimit;
    
    this.showQuizScreen();
    this.startTimer();
    this.displayQuestion();
    
    console.log('▶️ Quiz started');
  }
  
  /**
   * Show quiz screen
   */
  showQuizScreen() {
    if (this.startScreen) {
      this.startScreen.hidden = true;
    }

    if (this.quizScreen) {
      this.quizScreen.hidden = false;
    }

    if (this.resultsScreen) {
      this.resultsScreen.hidden = true;
    }
    
    // Hide header progress to avoid confusion
    const headerProgress = document.getElementById('headerProgress');
    if (headerProgress) {
      headerProgress.style.display = 'none';
    }
  }  /**
   * Start quiz timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }
  
  /**
   * Update timer display
   */
  updateTimerDisplay() {
    if (this.timerDisplay) {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Add warning color when time is running low
      if (this.timeRemaining <= 60) {
        this.timerDisplay.classList.add('time-warning');
      } else if (this.timeRemaining <= 300) {
        this.timerDisplay.classList.add('time-caution');
      }
    }
  }
  
  /**
   * Handle time up
   */
  timeUp() {
    this.stopTimer();
    announceToScreenReader('Time is up! Submitting quiz.');
    this.completeQuiz();
  }
  
  /**
   * Stop timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  /**
   * Display current question
   */
  displayQuestion() {
    const question = this.quizData.questions[this.currentQuestion];
    if (!question) return;
    
    // Update question counter
    if (this.questionCounter) {
      this.questionCounter.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.questions.length}`;
    }
    
    // Update question text
    if (this.questionText) {
      this.questionText.textContent = question.question;
    }
    
    // Update question image
    if (this.questionImage && question.image) {
      this.questionImage.src = question.image;
      this.questionImage.alt = `Illustration for question ${this.currentQuestion + 1}`;
      this.questionImage.style.display = 'block';
    } else if (this.questionImage) {
      this.questionImage.style.display = 'none';
    }
    
    // Create answer options
    this.createAnswerOptions(question);
    
    // Update navigation buttons
    this.updateNavigationButtons();
  }
  
  /**
   * Create answer options for current question
   */
  createAnswerOptions(question) {
    if (!this.answersContainer) return;
    
    this.answersContainer.innerHTML = '';
    
    const savedAnswer = this.answers[this.currentQuestion];
    
    question.answers.forEach((answer, index) => {
      const answerElement = document.createElement('div');
      answerElement.className = 'answer-option';
      
      if (question.type === 'single' || question.type === 'boolean') {
        // Radio button for single answer
        answerElement.innerHTML = `
          <label class="answer-label">
            <input type="radio" name="question_${question.id}" value="${answer.id}" 
                   ${savedAnswer === answer.id ? 'checked' : ''}>
            <span class="answer-text">${answer.text}</span>
          </label>
        `;
        
        const radio = answerElement.querySelector('input');
        radio.addEventListener('change', () => {
          this.selectAnswer(answer.id);
        });
        
      } else if (question.type === 'multiple') {
        // Checkbox for multiple answers
        const isChecked = Array.isArray(savedAnswer) && savedAnswer.includes(answer.id);
        
        answerElement.innerHTML = `
          <label class="answer-label">
            <input type="checkbox" name="question_${question.id}" value="${answer.id}"
                   ${isChecked ? 'checked' : ''}>
            <span class="answer-text">${answer.text}</span>
          </label>
        `;
        
        const checkbox = answerElement.querySelector('input');
        checkbox.addEventListener('change', () => {
          this.selectMultipleAnswer(answer.id, checkbox.checked);
        });
      }
      
      this.answersContainer.appendChild(answerElement);
    });
  }
  
  /**
   * Handle single answer selection
   */
  selectAnswer(answerId) {
    this.answers[this.currentQuestion] = answerId;
    this.saveQuizProgress();
    console.log(`📝 Answer selected: ${answerId}`);
  }
  
  /**
   * Handle multiple answer selection
   */
  selectMultipleAnswer(answerId, isSelected) {
    if (!Array.isArray(this.answers[this.currentQuestion])) {
      this.answers[this.currentQuestion] = [];
    }
    
    if (isSelected) {
      if (!this.answers[this.currentQuestion].includes(answerId)) {
        this.answers[this.currentQuestion].push(answerId);
      }
    } else {
      const index = this.answers[this.currentQuestion].indexOf(answerId);
      if (index > -1) {
        this.answers[this.currentQuestion].splice(index, 1);
      }
    }
    
    this.saveQuizProgress();
    console.log(`📝 Multiple answers: ${this.answers[this.currentQuestion]}`);
  }
  
  /**
   * Navigate to next question
   */
  nextQuestion() {
    if (this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
      this.displayQuestion();
    } else {
      this.completeQuiz();
    }
  }
  
  /**
   * Navigate to previous question
   */
  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.displayQuestion();
    }
  }
  
  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentQuestion === 0;
    }

    const submitBtn = document.getElementById('submitQuiz');
    
    if (this.nextBtn) {
      if (this.currentQuestion === this.quizData.questions.length - 1) {
        // On last question, hide next button and show submit button
        this.nextBtn.hidden = true;
        if (submitBtn) {
          submitBtn.hidden = false;
        }
      } else {
        // On other questions, show next button and hide submit button
        this.nextBtn.hidden = false;
        this.nextBtn.textContent = 'Next Question';
        if (submitBtn) {
          submitBtn.hidden = true;
        }
      }
    }
  }  /**
   * Submit quiz (called by submit button)
   */
  submitQuiz() {
    // Check if all questions have been answered
    const unansweredQuestions = [];
    for (let i = 0; i < this.quizData.questions.length; i++) {
      if (this.answers[i] === undefined || this.answers[i] === null) {
        unansweredQuestions.push(i + 1);
      }
    }
    
    if (unansweredQuestions.length > 0) {
      const message = `Please answer all questions before submitting. Unanswered questions: ${unansweredQuestions.join(', ')}`;
      alert(message);
      announceToScreenReader(message);
      return;
    }
    
    // Confirm submission
    if (confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      this.completeQuiz();
    }
  }
  
  /**
   * Complete the quiz
   */
  completeQuiz() {
    this.stopTimer();
    this.isCompleted = true;
    this.calculateScore();
    this.showResults();
    this.saveCompletionData();
    
    console.log('🏁 Quiz completed');
  }
  
  /**
   * Calculate final score
   */
  calculateScore() {
    this.score = 0;
    
    this.quizData.questions.forEach((question, index) => {
      const userAnswer = this.answers[index];
      const correctAnswers = question.answers
        .filter(answer => answer.correct)
        .map(answer => answer.id);
      
      if (question.type === 'multiple') {
        // For multiple choice, partial credit based on correct selections
        if (Array.isArray(userAnswer) && userAnswer.length > 0) {
          const correctSelected = userAnswer.filter(id => correctAnswers.includes(id)).length;
          const incorrectSelected = userAnswer.filter(id => !correctAnswers.includes(id)).length;
          const totalCorrect = correctAnswers.length;
          
          if (incorrectSelected === 0 && correctSelected === totalCorrect) {
            this.score += 10; // Full points
          } else if (correctSelected > 0) {
            this.score += Math.max(0, (correctSelected / totalCorrect) * 10 - incorrectSelected * 2);
          }
        }
      } else {
        // For single/boolean, full points if correct
        if (correctAnswers.includes(userAnswer)) {
          this.score += 10;
        }
      }
    });
    
    this.score = Math.round(this.score);
  }
  
  /**
   * Show quiz results
   */
  showResults() {
    if (this.quizScreen) {
      this.quizScreen.hidden = true;
    }
    
    if (this.resultsScreen) {
      this.resultsScreen.hidden = false;
    }
    
    // Calculate percentage
    const percentage = Math.round((this.score / this.maxScore) * 100);
    const passed = percentage >= this.quizData.passingScore;
    
    // Update final score display
    if (this.finalScore) {
      this.finalScore.textContent = `${this.score}/${this.maxScore} (${percentage}%)`;
    }
    
    // Update passing status
    if (this.passingStatus) {
      this.passingStatus.textContent = passed ? 'Passed!' : 'Failed';
      this.passingStatus.className = passed ? 'status-pass' : 'status-fail';
    }
    
    // Create detailed score breakdown
    this.createScoreBreakdown();
    
    // Show/hide certificate options
    const certificateOptions = document.querySelector('.certificate-options');
    if (certificateOptions) {
      certificateOptions.style.display = passed ? 'block' : 'none';
    }
    
    // Scroll to results
    this.resultsScreen.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Create detailed score breakdown
   */
  createScoreBreakdown() {
    if (!this.scoreDetails) return;
    
    this.scoreDetails.innerHTML = '';
    
    this.quizData.questions.forEach((question, index) => {
      const userAnswer = this.answers[index];
      const correctAnswers = question.answers
        .filter(answer => answer.correct)
        .map(answer => answer.id);
      
      let isCorrect = false;
      let pointsEarned = 0;
      
      if (question.type === 'multiple') {
        if (Array.isArray(userAnswer)) {
          const correctSelected = userAnswer.filter(id => correctAnswers.includes(id)).length;
          const incorrectSelected = userAnswer.filter(id => !correctAnswers.includes(id)).length;
          const totalCorrect = correctAnswers.length;
          
          isCorrect = incorrectSelected === 0 && correctSelected === totalCorrect;
          if (isCorrect) {
            pointsEarned = 10;
          } else if (correctSelected > 0) {
            pointsEarned = Math.max(0, (correctSelected / totalCorrect) * 10 - incorrectSelected * 2);
          }
        }
      } else {
        isCorrect = correctAnswers.includes(userAnswer);
        pointsEarned = isCorrect ? 10 : 0;
      }
      
      const questionElement = document.createElement('div');
      questionElement.className = `question-result ${isCorrect ? 'correct' : 'incorrect'}`;
      
      questionElement.innerHTML = `
        <div class="question-header">
          <span class="question-number">Q${index + 1}</span>
          <span class="question-points">${Math.round(pointsEarned)}/10</span>
        </div>
        <p class="question-title">${question.question}</p>
        ${question.explanation ? `<p class="question-explanation">${question.explanation}</p>` : ''}
      `;
      
      this.scoreDetails.appendChild(questionElement);
    });
  }
  
  /**
   * Retry the quiz
   */
  retryQuiz() {
    this.currentQuestion = 0;
    this.answers = new Array(this.quizData.questions.length);
    this.score = 0;
    this.timeRemaining = this.timeLimit;
    this.isCompleted = false;
    
    this.showQuizScreen();
    this.displayQuestion();
    this.startTimer();
    
    console.log('🔄 Quiz restarted');
  }
  
  /**
   * Preview certificate in modal
   */
  previewCertificate() {
    const modal = document.getElementById('certificateModal');
    if (!modal) return;
    
    this.generateCertificateContent();
    modal.hidden = false;
    
    // Focus management for accessibility
    setTimeout(() => {
      const closeBtn = document.getElementById('closeCertificateModal');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }
  
  /**
   * Generate certificate content
   */
  generateCertificateContent() {
    const template = document.getElementById('certificateTemplate');
    if (!template) return;
    
    const today = new Date();
    const percentage = Math.round((this.score / this.maxScore) * 100);
    
    // Fill in certificate data
    const certStudentName = template.querySelector('.cert-student-name');
    const certCourse = template.querySelector('.cert-course-name');
    const certScore = template.querySelector('.cert-score');
    const certDate = template.querySelector('.cert-date');
    const certId = template.querySelector('.cert-id');
    
    if (certStudentName) {
      certStudentName.textContent = this.studentInfo.name;
    }
    
    if (certCourse) {
      certCourse.textContent = this.quizData.title;
    }
    
    if (certScore) {
      certScore.textContent = `${percentage}%`;
    }
    
    if (certDate) {
      certDate.textContent = today.toLocaleDateString();
    }
    
    if (certId) {
      const certificateId = this.generateCertificateId();
      certId.textContent = certificateId;
    }
  }
  
  /**
   * Generate unique certificate ID
   */
  generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SL-${this.currentModule.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
  }
  
  /**
   * Download certificate as PDF
   */
  async downloadCertificate() {
    if (typeof html2pdf === 'undefined') {
      console.error('html2pdf library not loaded');
      return;
    }
    
    this.generateCertificateContent();
    
    const template = document.getElementById('certificateTemplate');
    if (!template) return;
    
    const options = {
      margin: 0,
      filename: `suraksha-learn-certificate-${this.studentInfo.name.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'landscape' 
      }
    };
    
    try {
      await html2pdf().set(options).from(template).save();
      console.log('📄 Certificate downloaded');
      announceToScreenReader('Certificate downloaded successfully');
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      announceToScreenReader('Failed to generate certificate');
    }
  }
  
  /**
   * Save quiz progress to localStorage
   */
  saveQuizProgress() {
    const progress = {
      module: this.currentModule,
      currentQuestion: this.currentQuestion,
      answers: this.answers,
      timeRemaining: this.timeRemaining,
      studentInfo: this.studentInfo,
      timestamp: Date.now()
    };
    
    localStorage.setItem('suraksha-quiz-progress', JSON.stringify(progress));
  }
  
  /**
   * Load quiz progress from localStorage
   */
  loadQuizProgress() {
    const saved = localStorage.getItem('suraksha-quiz-progress');
    if (!saved) return;
    
    try {
      const progress = JSON.parse(saved);
      
      // Only load if it's for the same module and recent (within 1 hour)
      if (progress.module === this.currentModule && 
          Date.now() - progress.timestamp < 3600000) {
        
        // Ask user if they want to resume
        const resume = confirm('You have an unfinished quiz. Would you like to resume where you left off?');
        if (resume) {
          this.currentQuestion = progress.currentQuestion || 0;
          this.answers = progress.answers || new Array(this.quizData.questions.length);
          this.timeRemaining = progress.timeRemaining || this.timeLimit;
          this.studentInfo = progress.studentInfo || {};
          
          console.log('📂 Quiz progress loaded');
        }
      }
    } catch (error) {
      console.warn('Failed to load quiz progress:', error);
    }
  }
  
  /**
   * Save completion data for dashboard
   */
  saveCompletionData() {
    const percentage = Math.round((this.score / this.maxScore) * 100);
    const passed = percentage >= this.quizData.passingScore;
    
    const completion = {
      type: 'quiz',
      module: this.currentModule,
      score: this.score,
      maxScore: this.maxScore,
      percentage: percentage,
      passed: passed,
      timeSpent: this.timeLimit - this.timeRemaining,
      studentInfo: this.studentInfo,
      answers: this.answers,
      completedAt: new Date().toISOString()
    };
    
    // Get existing completions
    const existingCompletions = JSON.parse(
      localStorage.getItem('suraksha-completions') || '[]'
    );
    
    // Add new completion
    existingCompletions.push(completion);
    
    // Keep only last 20 completions
    if (existingCompletions.length > 20) {
      existingCompletions.splice(0, existingCompletions.length - 20);
    }
    
    localStorage.setItem('suraksha-completions', JSON.stringify(existingCompletions));
    
    console.log('💾 Quiz completion data saved');
  }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.disasterQuiz = new DisasterQuiz();
});