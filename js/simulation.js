/**
 * Suraksha Learn - Simulation Logic
 * Handles branching disaster response simulations with state management
 */

class DisasterSimulation {
  constructor() {
    this.currentModule = this.getModuleFromURL() || 'earthquake';
    this.currentStep = 0;
    this.totalSteps = 3;
    this.safetyScore = 100;
    this.timeElapsed = 0;
    this.startTime = null;
    this.decisions = [];
    this.isRunning = false;
    this.isPaused = false;
    
    // DOM elements
    this.sceneImage = document.getElementById('sceneImage');
    this.sceneDescription = document.getElementById('sceneDescription');
    this.actionChoices = document.getElementById('actionChoices');
    this.actionFeedback = document.getElementById('actionFeedback');
    this.progressBar = document.getElementById('simulationProgress');
    this.stepCounter = document.getElementById('currentStep');
    this.totalStepsElement = document.getElementById('totalSteps');
    this.safetyScoreElement = document.getElementById('safetyScore');
    this.timeElapsedElement = document.getElementById('timeElapsed');
    this.continueBtn = document.getElementById('continueBtn');
    
    // Simulation data
    this.simulationData = this.getSimulationData();
    
    this.init();
  }
  
  /**
   * Initialize simulation
   */
  init() {
    console.log(`🎮 Initializing ${this.currentModule} simulation`);
    
    this.setupEventListeners();
    this.loadSimulationState();
    this.startSimulation();
    
    // Update total steps display
    if (this.totalStepsElement) {
      this.totalStepsElement.textContent = this.totalSteps;
    }
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
    // Continue button
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        this.nextStep();
      });
    }
    
    // Toolbar buttons
    const pauseBtn = document.getElementById('pauseBtn');
    const helpBtn = document.getElementById('helpBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pauseSimulation());
    }
    
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelp());
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetSimulation());
    }
    
    if (exitBtn) {
      exitBtn.addEventListener('click', () => this.exitSimulation());
    }
    
    // Overlay controls
    const overlayClose = document.getElementById('overlayClose');
    const overlayCancel = document.getElementById('overlayCancel');
    const overlayConfirm = document.getElementById('overlayConfirm');
    
    if (overlayClose) {
      overlayClose.addEventListener('click', () => this.hideOverlay());
    }
    
    if (overlayCancel) {
      overlayCancel.addEventListener('click', () => this.hideOverlay());
    }
    
    if (overlayConfirm) {
      overlayConfirm.addEventListener('click', () => this.handleOverlayConfirm());
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.pauseSimulation();
      } else if (e.key === ' ' && !this.isChoiceActive()) {
        e.preventDefault();
        this.nextStep();
      }
    });
  }
  
  /**
   * Get simulation data for the current module
   */
  getSimulationData() {
    const simulations = {
      earthquake: {
        title: 'Earthquake Response Simulation',
        scenes: [
          {
            image: 'assets/scene-classroom.jpg',
            description: 'You are in a classroom when suddenly the ground begins to shake. The earthquake has started. What do you do first?',
            choices: [
              {
                id: 'drop',
                title: 'Drop to the ground',
                description: 'Get down on hands and knees immediately',
                correct: true,
                points: 30,
                feedback: '✅ Excellent! Dropping immediately protects you from falling objects and prepares you for the next step.',
                consequence: 'You quickly drop to your hands and knees, following the first step of Drop, Cover, and Hold.'
              },
              {
                id: 'run',
                title: 'Run to the exit',
                description: 'Try to quickly leave the building',
                correct: false,
                points: -20,
                feedback: '❌ Running during an earthquake is dangerous! You could trip, fall, or be hit by falling objects.',
                consequence: 'As you run, you stumble and nearly fall. The shaking makes it impossible to move safely.'
              },
              {
                id: 'stand',
                title: 'Stand by the doorway',
                description: 'Move to stand in the doorway frame',
                correct: false,
                points: -10,
                feedback: '⚠️ This is an outdated practice. Modern doorways aren\'t stronger than other parts of the building.',
                consequence: 'You move to the doorway, but it\'s not as safe as you thought it would be.'
              }
            ]
          },
          {
            image: 'assets/scene-under-desk.jpg',
            description: 'The shaking continues. You are now on the ground. What should you do next?',
            choices: [
              {
                id: 'cover',
                title: 'Take cover under a desk',
                description: 'Crawl under the nearest sturdy desk or table',
                correct: true,
                points: 30,
                feedback: '✅ Perfect! Taking cover protects you from falling debris and objects.',
                consequence: 'You crawl under a sturdy desk, protecting yourself from falling objects.'
              },
              {
                id: 'center',
                title: 'Stay in open center',
                description: 'Remain in the center of the room away from objects',
                correct: false,
                points: -15,
                feedback: '⚠️ While avoiding objects is good, cover provides better protection from falling debris.',
                consequence: 'You stay in the open, but without cover, you\'re exposed to falling objects.'
              },
              {
                id: 'window',
                title: 'Move to the window',
                description: 'Get near the windows for potential escape',
                correct: false,
                points: -25,
                feedback: '❌ Windows can shatter during earthquakes. This is very dangerous!',
                consequence: 'You move toward the window just as it begins to crack from the shaking.'
              }
            ]
          },
          {
            image: 'assets/scene-holding-on.jpg',
            description: 'You are under cover as the earthquake continues. What is the final step?',
            choices: [
              {
                id: 'hold',
                title: 'Hold on and protect your head',
                description: 'Grab the desk legs and protect your head and neck',
                correct: true,
                points: 40,
                feedback: '✅ Excellent! You\'ve completed Drop, Cover, and Hold perfectly. This protects you from the desk moving away.',
                consequence: 'You hold onto the desk legs and protect your head. You ride out the earthquake safely.'
              },
              {
                id: 'peek',
                title: 'Look around to assess',
                description: 'Peek out to see what\'s happening around you',
                correct: false,
                points: -10,
                feedback: '⚠️ Stay covered! Looking around exposes you to falling objects.',
                consequence: 'As you peek out, some debris falls near your head.'
              },
              {
                id: 'prepare',
                title: 'Prepare to run when it stops',
                description: 'Get ready to evacuate immediately',
                correct: false,
                points: -15,
                feedback: '❌ Don\'t move until the shaking completely stops. Aftershocks are common.',
                consequence: 'You start to move too early and lose your balance as an aftershock hits.'
              }
            ]
          }
        ]
      },
      
      fire: {
        title: 'Fire Emergency Response Simulation',
        scenes: [
          {
            image: 'assets/scene-fire-detected.jpg',
            description: 'The fire alarm is sounding and you can smell smoke. What is your first action?',
            choices: [
              {
                id: 'alert',
                title: 'Alert others and call for help',
                description: 'Make sure everyone knows about the fire',
                correct: true,
                points: 30,
                feedback: '✅ Great! Alerting others and ensuring help is called saves lives.',
                consequence: 'You quickly alert your classmates and the teacher calls emergency services.'
              },
              {
                id: 'investigate',
                title: 'Investigate the source of smoke',
                description: 'Try to find where the smoke is coming from',
                correct: false,
                points: -20,
                feedback: '❌ Never investigate a fire yourself. Leave immediately and let professionals handle it.',
                consequence: 'As you investigate, the smoke gets thicker and you start coughing.'
              },
              {
                id: 'gather',
                title: 'Gather your belongings',
                description: 'Collect your important items before leaving',
                correct: false,
                points: -25,
                feedback: '❌ Never waste time collecting belongings during a fire emergency. Your life is most important!',
                consequence: 'While gathering items, precious evacuation time is lost and smoke fills the room.'
              }
            ]
          },
          {
            image: 'assets/scene-evacuation-route.jpg',
            description: 'Everyone is aware of the fire. How should you evacuate?',
            choices: [
              {
                id: 'exit-route',
                title: 'Use the designated exit route',
                description: 'Follow the posted evacuation plan',
                correct: true,
                points: 35,
                feedback: '✅ Perfect! Following the evacuation plan ensures the safest and fastest exit.',
                consequence: 'You follow the marked exit route and reach safety quickly and safely.'
              },
              {
                id: 'elevator',
                title: 'Take the elevator',
                description: 'Use the elevator to get out quickly',
                correct: false,
                points: -30,
                feedback: '❌ Never use elevators during a fire! They can trap you between floors or malfunction.',
                consequence: 'The elevator stops working and you\'re trapped between floors as smoke increases.'
              },
              {
                id: 'shortcut',
                title: 'Find a faster shortcut',
                description: 'Take a route you think might be quicker',
                correct: false,
                points: -15,
                feedback: '⚠️ Unknown routes might be blocked by fire or smoke. Stick to designated exits.',
                consequence: 'Your shortcut leads to a corridor filled with thick smoke.'
              }
            ]
          },
          {
            image: 'assets/scene-assembly-point.jpg',
            description: 'You\'ve safely exited the building. What should you do now?',
            choices: [
              {
                id: 'assembly',
                title: 'Go to the assembly point',
                description: 'Move to the designated gathering area',
                correct: true,
                points: 35,
                feedback: '✅ Excellent! Assembly points help account for everyone and keep you safe from the building.',
                consequence: 'You join others at the assembly point where attendance is taken to ensure everyone is safe.'
              },
              {
                id: 'return',
                title: 'Go back to help others',
                description: 'Return to the building to assist anyone left behind',
                correct: false,
                points: -25,
                feedback: '❌ Never re-enter a burning building! Leave rescue to trained firefighters.',
                consequence: 'You try to go back but are stopped by thick smoke and increasing heat.'
              },
              {
                id: 'watch',
                title: 'Stay close to watch the firefighters',
                description: 'Remain near the building to observe the response',
                correct: false,
                points: -10,
                feedback: '⚠️ Stay well away from the building and let emergency responders work.',
                consequence: 'You stay too close and have to be moved further back by arriving firefighters.'
              }
            ]
          }
        ]
      }
    };
    
    return simulations[this.currentModule] || simulations.earthquake;
  }
  
  /**
   * Start the simulation
   */
  startSimulation() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.currentStep = 0;
    this.safetyScore = 100;
    this.decisions = [];
    
    this.displayCurrentScene();
    this.startTimer();
    
    console.log('▶️ Simulation started');
  }
  
  /**
   * Display the current simulation scene
   */
  displayCurrentScene() {
    const scene = this.simulationData.scenes[this.currentStep];
    if (!scene) return;
    
    // Update scene image
    if (this.sceneImage) {
      this.sceneImage.src = scene.image;
      this.sceneImage.alt = `Scene ${this.currentStep + 1}`;
    }
    
    // Update scene description
    if (this.sceneDescription) {
      const descElement = this.sceneDescription.querySelector('p');
      if (descElement) {
        descElement.textContent = scene.description;
      }
    }
    
    // Create action choices
    this.createActionChoices(scene.choices);
    
    // Update progress
    this.updateProgress();
    
    // Hide feedback initially
    if (this.actionFeedback) {
      this.actionFeedback.hidden = true;
    }
  }
  
  /**
   * Create action choice buttons
   */
  createActionChoices(choices) {
    if (!this.actionChoices) return;
    
    this.actionChoices.innerHTML = '';
    
    choices.forEach((choice, index) => {
      const choiceElement = document.createElement('button');
      choiceElement.className = 'action-choice';
      choiceElement.setAttribute('data-choice-id', choice.id);
      
      choiceElement.innerHTML = `
        <div class="choice-title">${choice.title}</div>
        <p class="choice-description">${choice.description}</p>
      `;
      
      choiceElement.addEventListener('click', () => {
        this.selectChoice(choice, choiceElement);
      });
      
      // Keyboard navigation
      choiceElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectChoice(choice, choiceElement);
        }
      });
      
      this.actionChoices.appendChild(choiceElement);
    });
  }
  
  /**
   * Handle choice selection
   */
  selectChoice(choice, choiceElement) {
    if (!this.isRunning || this.isPaused) return;
    
    // Mark choice as selected
    const allChoices = this.actionChoices.querySelectorAll('.action-choice');
    allChoices.forEach(el => {
      el.classList.remove('selected', 'correct', 'incorrect');
      el.disabled = true;
    });
    
    choiceElement.classList.add('selected');
    
    // Add correct/incorrect styling
    if (choice.correct) {
      choiceElement.classList.add('correct');
    } else {
      choiceElement.classList.add('incorrect');
    }
    
    // Update safety score
    this.safetyScore = Math.max(0, Math.min(100, this.safetyScore + choice.points));
    this.updateSafetyScore();
    
    // Record decision
    this.decisions.push({
      step: this.currentStep + 1,
      choice: choice.title,
      correct: choice.correct,
      points: choice.points,
      feedback: choice.feedback
    });
    
    // Show feedback
    this.showFeedback(choice);
    
    // Save progress
    this.saveSimulationState();
    
    console.log(`🎯 Choice selected: ${choice.title} (${choice.points} points)`);
  }
  
  /**
   * Show feedback for the selected choice
   */
  showFeedback(choice) {
    if (!this.actionFeedback) return;
    
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    
    // Set feedback class based on choice correctness
    this.actionFeedback.className = 'action-feedback';
    if (choice.correct) {
      this.actionFeedback.classList.add('success');
      if (feedbackIcon) feedbackIcon.textContent = '✅';
    } else if (choice.points < -15) {
      this.actionFeedback.classList.add('error');
      if (feedbackIcon) feedbackIcon.textContent = '❌';
    } else {
      this.actionFeedback.classList.add('warning');
      if (feedbackIcon) feedbackIcon.textContent = '⚠️';
    }
    
    // Set feedback text
    if (feedbackText) {
      feedbackText.innerHTML = `
        <p><strong>${choice.feedback}</strong></p>
        <p>${choice.consequence}</p>
      `;
    }
    
    this.actionFeedback.hidden = false;
    
    // Animate feedback appearance
    if (typeof gsap !== 'undefined') {
      gsap.from(this.actionFeedback, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Move to next simulation step
   */
  nextStep() {
    this.currentStep++;
    
    if (this.currentStep < this.simulationData.scenes.length) {
      this.displayCurrentScene();
    } else {
      this.completeSimulation();
    }
  }
  
  /**
   * Complete the simulation
   */
  completeSimulation() {
    this.isRunning = false;
    this.stopTimer();
    
    // Hide main simulation UI
    const viewport = document.querySelector('.simulation-viewport');
    if (viewport) {
      viewport.style.display = 'none';
    }
    
    // Show summary
    this.showSummary();
    
    // Save completion data
    this.saveCompletionData();
    
    console.log('🏁 Simulation completed');
  }
  
  /**
   * Show simulation summary
   */
  showSummary() {
    const summary = document.getElementById('simulationSummary');
    if (!summary) return;
    
    summary.hidden = false;
    
    // Update final score circle
    const finalScoreCircle = document.getElementById('finalScoreCircle');
    const finalScoreText = document.getElementById('finalScoreText');
    
    if (finalScoreCircle && finalScoreText) {
      const scorePercentage = this.safetyScore;
      finalScoreCircle.style.strokeDasharray = `${scorePercentage}, 100`;
      finalScoreText.textContent = `${scorePercentage}%`;
    }
    
    // Populate decision timeline
    this.populateDecisionTimeline();
    
    // Generate learning points
    this.generateLearningPoints();
    
    // Generate improvement tips
    this.generateImprovementTips();
    
    // Setup summary actions
    this.setupSummaryActions();
    
    // Scroll to summary
    summary.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Populate decision timeline in summary
   */
  populateDecisionTimeline() {
    const timeline = document.getElementById('decisionTimeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    this.decisions.forEach((decision, index) => {
      const decisionElement = document.createElement('div');
      decisionElement.className = `decision-item ${decision.correct ? 'correct' : 'incorrect'}`;
      
      decisionElement.innerHTML = `
        <div class="decision-number">${decision.step}</div>
        <div class="decision-content">
          <div class="decision-choice">${decision.choice}</div>
          <p class="decision-result">${decision.feedback.replace(/[✅❌⚠️]/g, '').trim()}</p>
        </div>
      `;
      
      timeline.appendChild(decisionElement);
    });
  }
  
  /**
   * Generate learning points based on performance
   */
  generateLearningPoints() {
    const learningPoints = document.getElementById('learningPoints');
    if (!learningPoints) return;
    
    learningPoints.innerHTML = '';
    
    const points = this.getModuleLearningPoints();
    
    points.forEach(point => {
      const pointElement = document.createElement('div');
      pointElement.className = 'learning-point';
      pointElement.innerHTML = `<p class="learning-point-text">${point}</p>`;
      learningPoints.appendChild(pointElement);
    });
  }
  
  /**
   * Get module-specific learning points
   */
  getModuleLearningPoints() {
    const learningPoints = {
      earthquake: [
        'Drop, Cover, and Hold is the internationally recommended response to earthquakes',
        'Never run during an earthquake - falling objects are a major hazard',
        'Stay under cover until shaking completely stops, as aftershocks are common',
        'Modern doorway frames are not stronger than other parts of buildings'
      ],
      fire: [
        'Alert others immediately when you discover a fire - every second counts',
        'Never use elevators during a fire emergency',
        'Follow designated evacuation routes for the safest exit',
        'Assembly points help ensure everyone is accounted for and safe'
      ]
    };
    
    return learningPoints[this.currentModule] || learningPoints.earthquake;
  }
  
  /**
   * Generate improvement tips based on mistakes
   */
  generateImprovementTips() {
    const improvementTips = document.getElementById('improvementTips');
    if (!improvementTips) return;
    
    improvementTips.innerHTML = '';
    
    const incorrectDecisions = this.decisions.filter(d => !d.correct);
    
    if (incorrectDecisions.length === 0) {
      const tipElement = document.createElement('div');
      tipElement.className = 'improvement-tip';
      tipElement.innerHTML = `<p class="improvement-tip-text">Perfect performance! You made all the correct decisions.</p>`;
      improvementTips.appendChild(tipElement);
    } else {
      incorrectDecisions.forEach(decision => {
        const tipElement = document.createElement('div');
        tipElement.className = 'improvement-tip';
        tipElement.innerHTML = `<p class="improvement-tip-text">Review the correct response for step ${decision.step}: ${this.getCorrectChoiceForStep(decision.step - 1)}</p>`;
        improvementTips.appendChild(tipElement);
      });
    }
  }
  
  /**
   * Get correct choice text for a given step
   */
  getCorrectChoiceForStep(stepIndex) {
    const scene = this.simulationData.scenes[stepIndex];
    if (!scene) return '';
    
    const correctChoice = scene.choices.find(choice => choice.correct);
    return correctChoice ? correctChoice.title : '';
  }
  
  /**
   * Setup summary action buttons
   */
  setupSummaryActions() {
    const restartBtn = document.getElementById('restartSimulation');
    const shareBtn = document.getElementById('shareResults');
    
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.resetSimulation();
      });
    }
    
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareResults();
      });
    }
  }
  
  /**
   * Update progress bar and step counter
   */
  updateProgress() {
    const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
    
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
    
    if (this.stepCounter) {
      this.stepCounter.textContent = this.currentStep + 1;
    }
  }
  
  /**
   * Update safety score display
   */
  updateSafetyScore() {
    if (this.safetyScoreElement) {
      this.safetyScoreElement.textContent = `${this.safetyScore}%`;
      
      // Add visual feedback for score changes
      if (typeof gsap !== 'undefined') {
        gsap.from(this.safetyScoreElement, {
          scale: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      }
    }
  }
  
  /**
   * Start timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.isRunning && !this.isPaused) {
        this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.updateTimeDisplay();
      }
    }, 1000);
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
   * Update time display
   */
  updateTimeDisplay() {
    if (this.timeElapsedElement) {
      this.timeElapsedElement.textContent = formatTime(this.timeElapsed);
    }
  }
  
  /**
   * Check if a choice is currently being selected
   */
  isChoiceActive() {
    return document.activeElement && document.activeElement.classList.contains('action-choice');
  }
  
  /**
   * Pause simulation
   */
  pauseSimulation() {
    this.isPaused = true;
    this.showOverlay('pause');
  }
  
  /**
   * Show help overlay
   */
  showHelp() {
    this.showOverlay('help');
  }
  
  /**
   * Reset simulation
   */
  resetSimulation() {
    this.showOverlay('reset');
  }
  
  /**
   * Exit simulation
   */
  exitSimulation() {
    this.showOverlay('exit');
  }
  
  /**
   * Show overlay with specific content
   */
  showOverlay(type) {
    const overlay = document.getElementById('simulationOverlay');
    const title = document.getElementById('overlayTitle');
    const body = document.getElementById('overlayBody');
    
    if (!overlay || !title || !body) return;
    
    const overlayContent = {
      pause: {
        title: 'Simulation Paused',
        body: '<p>The simulation is paused. You can resume at any time.</p><p>Use this time to review your decisions so far.</p>',
        confirmText: 'Resume',
        action: 'resume'
      },
      help: {
        title: 'Simulation Help',
        body: `
          <h4>How to Use the Simulation</h4>
          <ul>
            <li>Read each scenario description carefully</li>
            <li>Choose the best response from the available options</li>
            <li>Receive immediate feedback on your choice</li>
            <li>Your safety score reflects the quality of your decisions</li>
          </ul>
          <h4>Keyboard Controls</h4>
          <ul>
            <li>ESC - Pause simulation</li>
            <li>SPACE - Continue to next step</li>
            <li>ENTER - Select highlighted choice</li>
          </ul>
        `,
        confirmText: 'Got it',
        action: 'close'
      },
      reset: {
        title: 'Reset Simulation',
        body: '<p>Are you sure you want to restart the simulation?</p><p>All progress will be lost.</p>',
        confirmText: 'Reset',
        action: 'confirm-reset'
      },
      exit: {
        title: 'Exit Simulation',
        body: '<p>Are you sure you want to exit the simulation?</p><p>Your progress will be saved.</p>',
        confirmText: 'Exit',
        action: 'confirm-exit'
      }
    };
    
    const content = overlayContent[type];
    if (!content) return;
    
    title.textContent = content.title;
    body.innerHTML = content.body;
    
    const confirmBtn = document.getElementById('overlayConfirm');
    if (confirmBtn) {
      confirmBtn.textContent = content.confirmText;
      confirmBtn.setAttribute('data-action', content.action);
    }
    
    overlay.hidden = false;
    
    // Focus management for accessibility
    setTimeout(() => {
      const closeBtn = document.getElementById('overlayClose');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }
  
  /**
   * Hide overlay
   */
  hideOverlay() {
    const overlay = document.getElementById('simulationOverlay');
    if (overlay) {
      overlay.hidden = true;
    }
    
    this.isPaused = false;
  }
  
  /**
   * Handle overlay confirm action
   */
  handleOverlayConfirm() {
    const confirmBtn = document.getElementById('overlayConfirm');
    const action = confirmBtn?.getAttribute('data-action');
    
    switch (action) {
      case 'resume':
        this.hideOverlay();
        break;
      case 'close':
        this.hideOverlay();
        break;
      case 'confirm-reset':
        this.hideOverlay();
        this.doReset();
        break;
      case 'confirm-exit':
        this.hideOverlay();
        this.doExit();
        break;
    }
  }
  
  /**
   * Actually reset the simulation
   */
  doReset() {
    this.stopTimer();
    this.currentStep = 0;
    this.safetyScore = 100;
    this.timeElapsed = 0;
    this.decisions = [];
    
    // Hide summary
    const summary = document.getElementById('simulationSummary');
    if (summary) {
      summary.hidden = true;
    }
    
    // Show viewport
    const viewport = document.querySelector('.simulation-viewport');
    if (viewport) {
      viewport.style.display = '';
    }
    
    this.startSimulation();
  }
  
  /**
   * Actually exit the simulation
   */
  doExit() {
    this.stopTimer();
    this.saveSimulationState();
    window.location.href = 'lesson.html?module=' + this.currentModule;
  }
  
  /**
   * Share simulation results
   */
  shareResults() {
    const text = `I just completed the ${this.simulationData.title} on Suraksha Learn with a ${this.safetyScore}% safety score! 🎯`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Suraksha Learn Simulation Results',
        text: text,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        announceToScreenReader('Results copied to clipboard');
      });
    }
  }
  
  /**
   * Save simulation state to localStorage
   */
  saveSimulationState() {
    const state = {
      module: this.currentModule,
      currentStep: this.currentStep,
      safetyScore: this.safetyScore,
      timeElapsed: this.timeElapsed,
      decisions: this.decisions,
      timestamp: Date.now()
    };
    
    localStorage.setItem('suraksha-simulation-state', JSON.stringify(state));
  }
  
  /**
   * Load simulation state from localStorage
   */
  loadSimulationState() {
    const saved = localStorage.getItem('suraksha-simulation-state');
    if (!saved) return;
    
    try {
      const state = JSON.parse(saved);
      
      // Only load if it's for the same module and recent (within 1 hour)
      if (state.module === this.currentModule && 
          Date.now() - state.timestamp < 3600000) {
        
        this.currentStep = state.currentStep || 0;
        this.safetyScore = state.safetyScore || 100;
        this.timeElapsed = state.timeElapsed || 0;
        this.decisions = state.decisions || [];
        
        console.log('📂 Simulation state loaded');
      }
    } catch (error) {
      console.warn('Failed to load simulation state:', error);
    }
  }
  
  /**
   * Save completion data for dashboard
   */
  saveCompletionData() {
    const completion = {
      module: this.currentModule,
      score: this.safetyScore,
      timeElapsed: this.timeElapsed,
      decisions: this.decisions,
      completedAt: new Date().toISOString(),
      passed: this.safetyScore >= 70
    };
    
    // Get existing completions
    const existingCompletions = JSON.parse(
      localStorage.getItem('suraksha-completions') || '[]'
    );
    
    // Add new completion
    existingCompletions.push(completion);
    
    // Keep only last 10 completions
    if (existingCompletions.length > 10) {
      existingCompletions.splice(0, existingCompletions.length - 10);
    }
    
    localStorage.setItem('suraksha-completions', JSON.stringify(existingCompletions));
    
    console.log('💾 Completion data saved');
  }
}

// Initialize simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.disasterSimulation = new DisasterSimulation();
});