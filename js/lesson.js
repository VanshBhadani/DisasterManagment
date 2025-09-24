/**
 * Suraksha Learn - Lesson Logic
 * Handles video lessons, interactive activities, and progress tracking
 */

class LessonPlayer {
  constructor() {
    this.currentModule = this.getModuleFromURL() || 'earthquake';
    this.currentVideoIndex = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.playbackRate = 1;
    this.watchedSegments = [];
    this.quizAnswers = {};
    this.activityCompleted = false;
    this.lessonProgress = 0;
    
    // DOM elements
    this.video = document.getElementById('lessonVideo');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.progressBar = document.getElementById('videoProgress');
    this.progressHandle = document.getElementById('progressHandle');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.volumeBtn = document.getElementById('volumeBtn');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.speedBtn = document.getElementById('speedBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.transcriptBtn = document.getElementById('transcriptBtn');
    
    // Activity elements
    this.activityContainer = document.getElementById('interactiveActivity');
    this.dragItems = null;
    this.dropZones = null;
    
    // Progress elements
    this.progressCircle = document.getElementById('progressCircle');
    this.progressText = document.getElementById('progressText');
    this.moduleList = document.getElementById('moduleList');
    
    // Lesson data
    this.lessonData = this.getLessonData();
    
    this.init();
  }
  
  /**
   * Initialize lesson player
   */
  init() {
    console.log(`📚 Initializing ${this.currentModule} lesson`);
    
    this.setupEventListeners();
    this.loadLessonContent();
    this.setupInteractiveActivity();
    this.loadProgress();
    this.updateModuleList();
    
    // Auto-save progress every 30 seconds
    setInterval(() => {
      this.saveProgress();
    }, 30000);
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
    // Video events
    if (this.video) {
      this.video.addEventListener('loadedmetadata', () => {
        this.duration = this.video.duration;
        this.updateTimeDisplay();
      });
      
      this.video.addEventListener('timeupdate', () => {
        this.currentTime = this.video.currentTime;
        this.updateProgress();
        this.updateTimeDisplay();
        this.trackWatchedSegments();
      });
      
      this.video.addEventListener('play', () => {
        this.isPlaying = true;
        this.updatePlayPauseButton();
      });
      
      this.video.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updatePlayPauseButton();
      });
      
      this.video.addEventListener('ended', () => {
        this.onVideoEnded();
      });
    }
    
    // Control buttons
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }
    
    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => {
        this.toggleMute();
      });
    }
    
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }
    
    if (this.speedBtn) {
      this.speedBtn.addEventListener('click', () => {
        this.cyclePlaybackSpeed();
      });
    }
    
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
    
    if (this.transcriptBtn) {
      this.transcriptBtn.addEventListener('click', () => {
        this.toggleTranscript();
      });
    }
    
    // Progress bar interaction
    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => {
        this.seekToPosition(e);
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Don't handle shortcuts when typing
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'KeyK':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.seekBy(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.seekBy(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.adjustVolume(-0.1);
          break;
        case 'KeyF':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          this.toggleMute();
          break;
      }
    });
    
    // Action buttons
    const simulateBtn = document.getElementById('simulateBtn');
    const quizBtn = document.getElementById('quizBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (simulateBtn) {
      simulateBtn.addEventListener('click', () => {
        this.goToSimulation();
      });
    }
    
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        this.goToQuiz();
      });
    }
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadMaterials();
      });
    }
  }
  
  /**
   * Get lesson data for the current module
   */
  getLessonData() {
    const lessons = {
      earthquake: {
        title: 'Earthquake Safety and Preparedness',
        description: 'Learn essential earthquake safety techniques including Drop, Cover, and Hold.',
        video: {
          src: 'assets/earthquake-lesson.mp4',
          poster: 'assets/earthquake-poster.jpg',
          duration: 480, // 8 minutes
          chapters: [
            { time: 0, title: 'Introduction to Earthquakes' },
            { time: 60, title: 'Warning Signs' },
            { time: 120, title: 'Drop, Cover, and Hold' },
            { time: 240, title: 'After the Earthquake' },
            { time: 360, title: 'Preparedness Planning' }
          ]
        },
        transcript: `
0:00 - Welcome to earthquake safety training. Earthquakes can happen anywhere, anytime, without warning.
1:00 - Watch for warning signs like minor foreshocks, but remember - not all earthquakes have warning signs.
2:00 - When an earthquake starts, immediately Drop, Cover, and Hold On. This is your best protection.
4:00 - After shaking stops, check for injuries and hazards. Be prepared for aftershocks.
6:00 - Prepare an emergency kit with water, food, and supplies for at least 72 hours.
        `,
        activity: {
          type: 'drag-drop',
          title: 'Earthquake Safety Actions',
          instruction: 'Drag the correct actions to the appropriate time during an earthquake.',
          items: [
            { id: 'drop', text: 'Drop to hands and knees', correct: 'during' },
            { id: 'cover', text: 'Take cover under desk', correct: 'during' },
            { id: 'hold', text: 'Hold on to shelter', correct: 'during' },
            { id: 'check', text: 'Check for injuries', correct: 'after' },
            { id: 'evacuate', text: 'Evacuate if building damaged', correct: 'after' },
            { id: 'supplies', text: 'Gather emergency supplies', correct: 'before' },
            { id: 'plan', text: 'Make family emergency plan', correct: 'before' },
            { id: 'run', text: 'Run to the exit', correct: 'never' }
          ],
          zones: [
            { id: 'before', label: 'Before Earthquake', accepts: ['supplies', 'plan'] },
            { id: 'during', label: 'During Earthquake', accepts: ['drop', 'cover', 'hold'] },
            { id: 'after', label: 'After Earthquake', accepts: ['check', 'evacuate'] },
            { id: 'never', label: 'Never Do', accepts: ['run'] }
          ]
        },
        materials: [
          { name: 'Earthquake Safety Checklist', type: 'PDF', size: '245 KB' },
          { name: 'Emergency Kit Guide', type: 'PDF', size: '189 KB' },
          { name: 'Family Emergency Plan Template', type: 'PDF', size: '156 KB' }
        ]
      },
      
      fire: {
        title: 'Fire Safety and Emergency Response',
        description: 'Master fire prevention, detection, and safe evacuation procedures.',
        video: {
          src: 'assets/fire-lesson.mp4',
          poster: 'assets/fire-poster.jpg',
          duration: 420, // 7 minutes
          chapters: [
            { time: 0, title: 'Fire Prevention Basics' },
            { time: 90, title: 'Smoke Detection Systems' },
            { time: 180, title: 'Evacuation Procedures' },
            { time: 300, title: 'Fire Extinguisher Use' }
          ]
        },
        transcript: `
0:00 - Fire safety starts with prevention. Keep flammable materials away from heat sources.
1:30 - Smoke detectors save lives. Test them monthly and change batteries annually.
3:00 - When fire alarm sounds, evacuate immediately using nearest exit route.
5:00 - Learn to use fire extinguishers: Pull, Aim, Squeeze, Sweep - but only for small fires.
        `,
        activity: {
          type: 'drag-drop',
          title: 'Fire Response Sequence',
          instruction: 'Arrange these fire emergency actions in the correct order.',
          items: [
            { id: 'alert', text: 'Alert others and call for help', order: 1 },
            { id: 'evacuate', text: 'Use nearest exit route', order: 2 },
            { id: 'crawl', text: 'Crawl under smoke if present', order: 3 },
            { id: 'assembly', text: 'Go to assembly point', order: 4 },
            { id: 'account', text: 'Account for all persons', order: 5 },
            { id: 'wait', text: 'Wait for emergency services', order: 6 }
          ],
          zones: [
            { id: 'sequence', label: 'Emergency Response Sequence', accepts: ['alert', 'evacuate', 'crawl', 'assembly', 'account', 'wait'] }
          ]
        },
        materials: [
          { name: 'Fire Safety Inspection Checklist', type: 'PDF', size: '198 KB' },
          { name: 'Evacuation Route Planning', type: 'PDF', size: '167 KB' },
          { name: 'Fire Extinguisher Types Guide', type: 'PDF', size: '134 KB' }
        ]
      }
    };
    
    return lessons[this.currentModule] || lessons.earthquake;
  }
  
  /**
   * Load lesson content
   */
  loadLessonContent() {
    // Update page title
    const lessonTitle = document.getElementById('lessonTitle');
    if (lessonTitle) {
      lessonTitle.textContent = this.lessonData.title;
    }
    
    const lessonDescription = document.getElementById('lessonDescription');
    if (lessonDescription) {
      lessonDescription.textContent = this.lessonData.description;
    }
    
    // Load video
    if (this.video && this.lessonData.video) {
      this.video.src = this.lessonData.video.src;
      if (this.lessonData.video.poster) {
        this.video.poster = this.lessonData.video.poster;
      }
    }
    
    // Create chapter markers
    this.createChapterMarkers();
    
    // Populate materials list
    this.populateMaterialsList();
  }
  
  /**
   * Create chapter markers on progress bar
   */
  createChapterMarkers() {
    if (!this.lessonData.video.chapters || !this.progressBar) return;
    
    const markersContainer = document.getElementById('chapterMarkers');
    if (!markersContainer) return;
    
    markersContainer.innerHTML = '';
    
    this.lessonData.video.chapters.forEach(chapter => {
      const marker = document.createElement('div');
      marker.className = 'chapter-marker';
      marker.style.left = `${(chapter.time / this.lessonData.video.duration) * 100}%`;
      marker.title = chapter.title;
      
      marker.addEventListener('click', () => {
        this.seekTo(chapter.time);
      });
      
      markersContainer.appendChild(marker);
    });
  }
  
  /**
   * Populate downloadable materials list
   */
  populateMaterialsList() {
    const materialsList = document.getElementById('materialsList');
    if (!materialsList || !this.lessonData.materials) return;
    
    materialsList.innerHTML = '';
    
    this.lessonData.materials.forEach(material => {
      const materialItem = document.createElement('div');
      materialItem.className = 'material-item';
      
      materialItem.innerHTML = `
        <div class="material-icon">${this.getMaterialIcon(material.type)}</div>
        <div class="material-info">
          <div class="material-name">${material.name}</div>
          <div class="material-meta">${material.type} • ${material.size}</div>
        </div>
        <button class="material-download" onclick="lessonPlayer.downloadMaterial('${material.name}')">
          <i class="icon-download"></i>
        </button>
      `;
      
      materialsList.appendChild(materialItem);
    });
  }
  
  /**
   * Get icon for material type
   */
  getMaterialIcon(type) {
    const icons = {
      'PDF': '📄',
      'DOC': '📝',
      'PPT': '📊',
      'XLS': '📈',
      'ZIP': '🗜️'
    };
    return icons[type] || '📄';
  }
  
  /**
   * Setup interactive drag-and-drop activity
   */
  setupInteractiveActivity() {
    if (!this.activityContainer || !this.lessonData.activity) return;
    
    const activity = this.lessonData.activity;
    
    // Create activity HTML
    this.activityContainer.innerHTML = `
      <div class="activity-header">
        <h3>${activity.title}</h3>
        <p class="activity-instruction">${activity.instruction}</p>
      </div>
      <div class="activity-content">
        <div class="drag-items" id="dragItems"></div>
        <div class="drop-zones" id="dropZones"></div>
      </div>
      <div class="activity-actions">
        <button id="checkActivity" class="btn btn-primary" disabled>Check Answers</button>
        <button id="resetActivity" class="btn btn-secondary">Reset</button>
      </div>
      <div id="activityFeedback" class="activity-feedback" hidden></div>
    `;
    
    this.setupDragAndDrop();
  }
  
  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    const dragItemsContainer = document.getElementById('dragItems');
    const dropZonesContainer = document.getElementById('dropZones');
    
    if (!dragItemsContainer || !dropZonesContainer) return;
    
    // Create drag items
    this.lessonData.activity.items.forEach(item => {
      const dragItem = document.createElement('div');
      dragItem.className = 'drag-item';
      dragItem.draggable = true;
      dragItem.setAttribute('data-id', item.id);
      dragItem.textContent = item.text;
      
      // Touch and mouse events
      dragItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
        dragItem.classList.add('dragging');
      });
      
      dragItem.addEventListener('dragend', () => {
        dragItem.classList.remove('dragging');
      });
      
      dragItemsContainer.appendChild(dragItem);
    });
    
    // Create drop zones
    this.lessonData.activity.zones.forEach(zone => {
      const dropZone = document.createElement('div');
      dropZone.className = 'drop-zone';
      dropZone.setAttribute('data-zone', zone.id);
      
      dropZone.innerHTML = `
        <div class="zone-header">${zone.label}</div>
        <div class="zone-content" data-accepts="${zone.accepts.join(',')}"></div>
      `;
      
      const zoneContent = dropZone.querySelector('.zone-content');
      
      // Drop zone events
      zoneContent.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      
      zoneContent.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });
      
      zoneContent.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const itemId = e.dataTransfer.getData('text/plain');
        const dragItem = document.querySelector(`[data-id="${itemId}"]`);
        
        if (dragItem) {
          // Remove from previous location
          if (dragItem.parentNode !== dragItemsContainer) {
            dragItem.parentNode.removeChild(dragItem);
          }
          
          // Add to new location
          zoneContent.appendChild(dragItem);
          dragItem.classList.remove('dragging');
          
          this.checkActivityCompletion();
        }
      });
      
      dropZonesContainer.appendChild(dropZone);
    });
    
    // Activity action buttons
    const checkBtn = document.getElementById('checkActivity');
    const resetBtn = document.getElementById('resetActivity');
    
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        this.checkActivityAnswers();
      });
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetActivity();
      });
    }
  }
  
  /**
   * Check if activity is ready to be checked
   */
  checkActivityCompletion() {
    const dragItems = document.querySelectorAll('.drag-item');
    const checkBtn = document.getElementById('checkActivity');
    
    // Check if all items are placed in zones
    let allPlaced = true;
    const dragItemsContainer = document.getElementById('dragItems');
    
    dragItems.forEach(item => {
      if (item.parentNode === dragItemsContainer) {
        allPlaced = false;
      }
    });
    
    if (checkBtn) {
      checkBtn.disabled = !allPlaced;
    }
  }
  
  /**
   * Check activity answers
   */
  checkActivityAnswers() {
    const activity = this.lessonData.activity;
    let correct = 0;
    let total = activity.items.length;
    const results = [];
    
    activity.zones.forEach(zone => {
      const zoneContent = document.querySelector(`[data-zone="${zone.id}"] .zone-content`);
      const itemsInZone = zoneContent.querySelectorAll('.drag-item');
      
      itemsInZone.forEach(item => {
        const itemId = item.getAttribute('data-id');
        const itemData = activity.items.find(i => i.id === itemId);
        
        if (itemData) {
          const isCorrect = zone.accepts.includes(itemId);
          results.push({
            item: itemData.text,
            zone: zone.label,
            correct: isCorrect
          });
          
          // Visual feedback
          item.classList.toggle('correct', isCorrect);
          item.classList.toggle('incorrect', !isCorrect);
          
          if (isCorrect) correct++;
        }
      });
    });
    
    // Show feedback
    this.showActivityFeedback(correct, total, results);
    
    // Update progress if activity completed successfully
    if (correct === total) {
      this.activityCompleted = true;
      this.updateOverallProgress();
      this.saveProgress();
    }
  }
  
  /**
   * Show activity feedback
   */
  showActivityFeedback(correct, total, results) {
    const feedback = document.getElementById('activityFeedback');
    if (!feedback) return;
    
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 80;
    
    feedback.className = `activity-feedback ${passed ? 'success' : 'error'}`;
    feedback.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-score">Score: ${correct}/${total} (${percentage}%)</div>
        <div class="feedback-status">${passed ? 'Great job!' : 'Keep trying!'}</div>
      </div>
      <div class="feedback-details">
        ${results.map(result => `
          <div class="feedback-item ${result.correct ? 'correct' : 'incorrect'}">
            ${result.correct ? '✅' : '❌'} "${result.item}" in "${result.zone}"
          </div>
        `).join('')}
      </div>
      ${!passed ? '<p class="feedback-hint">Review the lesson content and try again.</p>' : ''}
    `;
    
    feedback.hidden = false;
    
    // Animate feedback
    if (typeof gsap !== 'undefined') {
      gsap.from(feedback, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Reset activity to initial state
   */
  resetActivity() {
    const dragItemsContainer = document.getElementById('dragItems');
    const dragItems = document.querySelectorAll('.drag-item');
    const feedback = document.getElementById('activityFeedback');
    const checkBtn = document.getElementById('checkActivity');
    
    // Move all items back to original container
    dragItems.forEach(item => {
      item.classList.remove('correct', 'incorrect', 'dragging');
      dragItemsContainer.appendChild(item);
    });
    
    // Hide feedback
    if (feedback) {
      feedback.hidden = true;
    }
    
    // Disable check button
    if (checkBtn) {
      checkBtn.disabled = true;
    }
  }
  
  /**
   * Video control functions
   */
  togglePlayPause() {
    if (!this.video) return;
    
    if (this.isPlaying) {
      this.video.pause();
    } else {
      this.video.play();
    }
  }
  
  updatePlayPauseButton() {
    if (!this.playPauseBtn) return;
    
    const icon = this.playPauseBtn.querySelector('i');
    if (icon) {
      icon.className = this.isPlaying ? 'icon-pause' : 'icon-play';
    }
  }
  
  toggleMute() {
    if (!this.video) return;
    
    this.video.muted = !this.video.muted;
    this.updateVolumeButton();
  }
  
  setVolume(volume) {
    if (!this.video) return;
    
    this.volume = Math.max(0, Math.min(1, volume));
    this.video.volume = this.volume;
    this.video.muted = this.volume === 0;
    this.updateVolumeButton();
  }
  
  adjustVolume(delta) {
    this.setVolume(this.volume + delta);
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
    }
  }
  
  updateVolumeButton() {
    if (!this.volumeBtn) return;
    
    const icon = this.volumeBtn.querySelector('i');
    if (icon) {
      if (this.video.muted || this.volume === 0) {
        icon.className = 'icon-volume-mute';
      } else if (this.volume < 0.5) {
        icon.className = 'icon-volume-low';
      } else {
        icon.className = 'icon-volume-high';
      }
    }
  }
  
  cyclePlaybackSpeed() {
    if (!this.video) return;
    
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(this.playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    this.playbackRate = speeds[nextIndex];
    this.video.playbackRate = this.playbackRate;
    
    if (this.speedBtn) {
      this.speedBtn.textContent = `${this.playbackRate}x`;
    }
  }
  
  seekTo(time) {
    if (!this.video) return;
    this.video.currentTime = Math.max(0, Math.min(this.duration, time));
  }
  
  seekBy(seconds) {
    this.seekTo(this.currentTime + seconds);
  }
  
  seekToPosition(e) {
    if (!this.progressBar || !this.video) return;
    
    const rect = this.progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const time = position * this.duration;
    
    this.seekTo(time);
  }
  
  updateProgress() {
    if (!this.progressBar || this.duration === 0) return;
    
    const progress = (this.currentTime / this.duration) * 100;
    this.progressBar.style.setProperty('--progress', `${progress}%`);
    
    if (this.progressHandle) {
      this.progressHandle.style.left = `${progress}%`;
    }
  }
  
  updateTimeDisplay() {
    if (!this.timeDisplay) return;
    
    const currentFormatted = formatTime(this.currentTime);
    const durationFormatted = formatTime(this.duration);
    this.timeDisplay.textContent = `${currentFormatted} / ${durationFormatted}`;
  }
  
  trackWatchedSegments() {
    // Track which segments of the video have been watched
    const segmentSize = 10; // 10 second segments
    const segmentIndex = Math.floor(this.currentTime / segmentSize);
    
    if (!this.watchedSegments.includes(segmentIndex)) {
      this.watchedSegments.push(segmentIndex);
      this.updateOverallProgress();
    }
  }
  
  onVideoEnded() {
    this.updateOverallProgress();
    this.saveProgress();
    
    console.log('📹 Video completed');
    announceToScreenReader('Video lesson completed');
  }
  
  toggleFullscreen() {
    if (!this.video) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.video.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    }
  }
  
  toggleTranscript() {
    const transcript = document.getElementById('videoTranscript');
    if (!transcript) return;
    
    const isVisible = !transcript.hidden;
    transcript.hidden = isVisible;
    
    if (this.transcriptBtn) {
      this.transcriptBtn.classList.toggle('active', !isVisible);
    }
    
    // Populate transcript if first time showing
    if (!isVisible && !transcript.hasChildNodes()) {
      transcript.innerHTML = `
        <div class="transcript-content">
          <h4>Video Transcript</h4>
          <pre>${this.lessonData.transcript || 'Transcript not available for this lesson.'}</pre>
        </div>
      `;
    }
  }
  
  /**
   * Update overall lesson progress
   */
  updateOverallProgress() {
    const videoProgress = this.calculateVideoProgress();
    const activityProgress = this.activityCompleted ? 100 : 0;
    
    // Overall progress is weighted: 70% video, 30% activity
    this.lessonProgress = Math.round(videoProgress * 0.7 + activityProgress * 0.3);
    
    this.updateProgressCircle();
  }
  
  /**
   * Calculate video watching progress
   */
  calculateVideoProgress() {
    if (this.duration === 0) return 0;
    
    const totalSegments = Math.ceil(this.duration / 10);
    const watchedPercentage = (this.watchedSegments.length / totalSegments) * 100;
    
    return Math.min(100, watchedPercentage);
  }
  
  /**
   * Update progress circle display
   */
  updateProgressCircle() {
    if (this.progressCircle) {
      this.progressCircle.style.strokeDasharray = `${this.lessonProgress}, 100`;
    }
    
    if (this.progressText) {
      this.progressText.textContent = `${this.lessonProgress}%`;
    }
  }
  
  /**
   * Update module list with completion status
   */
  updateModuleList() {
    if (!this.moduleList) return;
    
    const modules = [
      { id: 'earthquake', name: 'Earthquake Safety', icon: '🏗️' },
      { id: 'fire', name: 'Fire Emergency', icon: '🔥' },
      { id: 'flood', name: 'Flood Preparedness', icon: '🌊' },
      { id: 'cyclone', name: 'Cyclone Safety', icon: '🌪️' }
    ];
    
    this.moduleList.innerHTML = '';
    
    modules.forEach(module => {
      const completed = this.isModuleCompleted(module.id);
      const isActive = module.id === this.currentModule;
      
      const moduleItem = document.createElement('div');
      moduleItem.className = `module-item ${isActive ? 'active' : ''} ${completed ? 'completed' : ''}`;
      
      moduleItem.innerHTML = `
        <div class="module-icon">${module.icon}</div>
        <div class="module-info">
          <div class="module-name">${module.name}</div>
          <div class="module-status">${completed ? 'Completed' : 'In Progress'}</div>
        </div>
        ${completed ? '<div class="completion-check">✅</div>' : ''}
      `;
      
      if (!isActive) {
        moduleItem.addEventListener('click', () => {
          window.location.href = `lesson.html?module=${module.id}`;
        });
      }
      
      this.moduleList.appendChild(moduleItem);
    });
  }
  
  /**
   * Check if module is completed
   */
  isModuleCompleted(moduleId) {
    const saved = localStorage.getItem('suraksha-lesson-progress');
    if (!saved) return false;
    
    try {
      const progress = JSON.parse(saved);
      return progress[moduleId] && progress[moduleId].completed;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Navigation functions
   */
  goToSimulation() {
    this.saveProgress();
    window.location.href = `simulate.html?module=${this.currentModule}`;
  }
  
  goToQuiz() {
    this.saveProgress();
    window.location.href = `quiz.html?module=${this.currentModule}`;
  }
  
  downloadMaterials() {
    console.log('📎 Downloading materials for', this.currentModule);
    
    // In a real implementation, this would trigger actual downloads
    this.lessonData.materials.forEach(material => {
      console.log(`Downloading: ${material.name}`);
    });
    
    announceToScreenReader(`Downloading ${this.lessonData.materials.length} materials`);
  }
  
  downloadMaterial(materialName) {
    console.log('📎 Downloading material:', materialName);
    announceToScreenReader(`Downloading ${materialName}`);
  }
  
  /**
   * Save progress to localStorage
   */
  saveProgress() {
    const progressData = {
      currentTime: this.currentTime,
      watchedSegments: this.watchedSegments,
      activityCompleted: this.activityCompleted,
      lessonProgress: this.lessonProgress,
      completed: this.lessonProgress >= 90,
      lastUpdated: new Date().toISOString()
    };
    
    // Get existing progress
    const existingProgress = JSON.parse(localStorage.getItem('suraksha-lesson-progress') || '{}');
    
    // Update progress for current module
    existingProgress[this.currentModule] = progressData;
    
    localStorage.setItem('suraksha-lesson-progress', JSON.stringify(existingProgress));
    
    console.log('💾 Progress saved for', this.currentModule);
  }
  
  /**
   * Load progress from localStorage
   */
  loadProgress() {
    const saved = localStorage.getItem('suraksha-lesson-progress');
    if (!saved) return;
    
    try {
      const allProgress = JSON.parse(saved);
      const moduleProgress = allProgress[this.currentModule];
      
      if (moduleProgress) {
        this.watchedSegments = moduleProgress.watchedSegments || [];
        this.activityCompleted = moduleProgress.activityCompleted || false;
        this.lessonProgress = moduleProgress.lessonProgress || 0;
        
        // Resume video position if recent (within 24 hours)
        const lastUpdated = new Date(moduleProgress.lastUpdated);
        const now = new Date();
        const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
        
        if (hoursDiff < 24 && moduleProgress.currentTime > 0) {
          setTimeout(() => {
            if (this.video && !isNaN(moduleProgress.currentTime)) {
              this.video.currentTime = moduleProgress.currentTime;
            }
          }, 1000);
        }
        
        this.updateProgressCircle();
        console.log('📂 Progress loaded for', this.currentModule);
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
    }
  }
}

// Initialize lesson player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.lessonPlayer = new LessonPlayer();
});