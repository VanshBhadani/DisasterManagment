/**
 * Suraksha Learn - Three.js Hero Scene
 * Creates an immersive 3D disaster preparedness visualization
 */

class HeroScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.animationId = null;
    
    // Scene objects
    this.classroom = null;
    this.particles = null;
    this.lights = [];
    
    // Animation state
    this.isAnimating = true;
    this.currentDisaster = 'calm';
    this.transitionProgress = 0;
    
    // Performance monitoring
    this.performanceLevel = 'high';
    this.frameCount = 0;
    this.lastFrameTime = 0;
    
    // Input handling
    this.mouse = { x: 0, y: 0 };
    this.scroll = 0;
    
    // Disaster states
    this.disasters = {
      calm: { intensity: 0, color: 0x4f46e5 },
      earthquake: { intensity: 0.8, color: 0xdc2626 },
      fire: { intensity: 0.6, color: 0xf59e0b },
      flood: { intensity: 0.4, color: 0x0ea5e9 }
    };
    
    this.init();
  }
  
  /**
   * Initialize the 3D scene
   */
  init() {
    try {
      this.canvas = document.getElementById('heroCanvas');
      if (!this.canvas) {
        console.warn('Hero canvas not found');
        return;
      }
      
      // Check WebGL support
      if (!this.checkWebGLSupport()) {
        this.showFallback();
        return;
      }
      
      this.setupRenderer();
      this.setupCamera();
      this.setupScene();
      this.setupLights();
      this.createClassroom();
      this.createParticleSystem();
      this.setupEventListeners();
      this.setupPerformanceMonitoring();
      
      // Start animation loop
      this.animate();
      
      console.log('✅ Hero 3D scene initialized');
    } catch (error) {
      console.error('❌ Error initializing 3D scene:', error);
      this.showFallback();
    }
  }
  
  /**
   * Check if WebGL is supported
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Show fallback image for unsupported devices
   */
  showFallback() {
    const canvas = document.getElementById('heroCanvas');
    const fallback = document.getElementById('heroFallback');
    
    if (canvas && fallback) {
      canvas.style.display = 'none';
      fallback.hidden = false;
      
      console.log('🖼️ Using fallback image for hero section');
    }
  }
  
  /**
   * Setup Three.js renderer
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.performanceLevel === 'high',
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }
  
  /**
   * Setup camera
   */
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);
  }
  
  /**
   * Setup Three.js scene
   */
  setupScene() {
    this.scene = new THREE.Scene();
    
    // Create gradient background
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    const backgroundTexture = new THREE.CanvasTexture(canvas);
    this.scene.background = backgroundTexture;
    
    // Add fog for depth
    this.scene.fog = new THREE.Fog(0x667eea, 10, 50);
  }
  
  /**
   * Setup lighting
   */
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
    
    // Point light for dynamic effects
    const pointLight = new THREE.PointLight(0xff6b35, 0.5, 20);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);
    this.lights.push(pointLight);
  }
  
  /**
   * Create classroom environment
   */
  createClassroom() {
    const classroomGroup = new THREE.Group();
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8b7355,
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    classroomGroup.add(floor);
    
    // Desks
    this.createDesks(classroomGroup);
    
    // Walls
    this.createWalls(classroomGroup);
    
    // Add some basic classroom objects
    this.createClassroomObjects(classroomGroup);
    
    classroomGroup.position.y = -1;
    this.scene.add(classroomGroup);
    this.classroom = classroomGroup;
  }
  
  /**
   * Create student desks
   */
  createDesks(parent) {
    // Materials for realistic school furniture
    const deskTopMaterial = new THREE.MeshLambertMaterial({ color: 0xd2b48c }); // Light wood
    const deskFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Dark wood frame
    const metalMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 }); // Metal legs
    
    const positions = [
      [-2, 0, -1], [0, 0, -1], [2, 0, -1],
      [-2, 0, 1], [0, 0, 1], [2, 0, 1]
    ];
    
    positions.forEach(pos => {
      const deskGroup = new THREE.Group();
      
      // Desktop surface - thinner and more realistic
      const desktop = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.04, 0.6), 
        deskTopMaterial
      );
      desktop.position.set(0, 0.4, 0);
      desktop.castShadow = true;
      desktop.receiveShadow = true;
      deskGroup.add(desktop);
      
      // Desk frame/edge
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.02, 0.06, 0.62), 
        deskFrameMaterial
      );
      frame.position.set(0, 0.37, 0);
      frame.castShadow = true;
      deskGroup.add(frame);
      
      // Metal desk legs (4 legs)
      const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
      const legPositions = [
        [-0.45, 0, -0.25], [0.45, 0, -0.25],
        [-0.45, 0, 0.25], [0.45, 0, 0.25]
      ];
      
      legPositions.forEach(legPos => {
        const leg = new THREE.Mesh(legGeometry, metalMaterial);
        leg.position.set(legPos[0], legPos[1], legPos[2]);
        leg.castShadow = true;
        deskGroup.add(leg);
      });
      
      // Under-desk storage/shelf
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.02, 0.5), 
        deskFrameMaterial
      );
      shelf.position.set(0, 0.15, 0);
      shelf.castShadow = true;
      deskGroup.add(shelf);
      
      deskGroup.position.set(pos[0], pos[1], pos[2]);
      parent.add(deskGroup);
      
      // Realistic school chair/bench
      const benchGroup = new THREE.Group();
      
      // Bench seat
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.04, 0.35), 
        deskTopMaterial
      );
      seat.position.set(0, 0.2, 0);
      seat.castShadow = true;
      seat.receiveShadow = true;
      benchGroup.add(seat);
      
      // Bench backrest
      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.25, 0.04), 
        deskFrameMaterial
      );
      backrest.position.set(0, 0.32, -0.15);
      backrest.castShadow = true;
      benchGroup.add(backrest);
      
      // Bench legs (2 side panels)
      const legPanel1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.4, 0.35), 
        metalMaterial
      );
      legPanel1.position.set(-0.4, 0, 0);
      legPanel1.castShadow = true;
      benchGroup.add(legPanel1);
      
      const legPanel2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.4, 0.35), 
        metalMaterial
      );
      legPanel2.position.set(0.4, 0, 0);
      legPanel2.castShadow = true;
      benchGroup.add(legPanel2);
      
      // Position bench behind desk
      benchGroup.position.set(pos[0], pos[1], pos[2] + 0.7);
      parent.add(benchGroup);
    });
  }
  
  /**
   * Create classroom walls
   */
  createWalls(parent) {
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf0f0f0,
      transparent: true,
      opacity: 0.7
    });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(20, 8);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 4, -10);
    parent.add(backWall);
    
    // Side walls
    const sideWallGeometry = new THREE.PlaneGeometry(20, 8);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 4, 0);
    parent.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(10, 4, 0);
    parent.add(rightWall);
  }
  
  /**
   * Create basic classroom objects
   */
  createClassroomObjects(parent) {
    // Blackboard
    const boardGeometry = new THREE.PlaneGeometry(4, 2);
    const boardMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const blackboard = new THREE.Mesh(boardGeometry, boardMaterial);
    blackboard.position.set(0, 3, -9.9);
    parent.add(blackboard);
    
    // Exit sign
    const signGeometry = new THREE.PlaneGeometry(1, 0.3);
    const signMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const exitSign = new THREE.Mesh(signGeometry, signMaterial);
    exitSign.position.set(8, 6, -9.9);
    parent.add(exitSign);
  }
  
  /**
   * Create particle system for disaster effects
   */
  createParticleSystem() {
    const particleCount = this.performanceLevel === 'high' ? 1000 : 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.6;
      
      sizes[i] = Math.random() * 2 + 1;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      vertexColors: true
    });
    
    this.particles = new THREE.Points(particles, particleMaterial);
    this.particles.visible = false;
    this.scene.add(this.particles);
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    
    // Scroll handling
    window.addEventListener('scroll', () => {
      this.scroll = window.pageYOffset / window.innerHeight;
    });
    
    // Intersection Observer for performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isAnimating = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      
      observer.observe(this.canvas);
    }
    
    // Visibility change
    document.addEventListener('visibilitychange', () => {
      this.isAnimating = !document.hidden;
    });
  }
  
  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor frame rate and adjust quality
    setInterval(() => {
      if (this.frameCount < 30) {
        this.performanceLevel = 'low';
        this.adjustPerformance();
      } else if (this.frameCount > 50) {
        this.performanceLevel = 'high';
      }
      this.frameCount = 0;
    }, 1000);
  }
  
  /**
   * Adjust performance based on frame rate
   */
  adjustPerformance() {
    if (this.performanceLevel === 'low') {
      // Reduce particle count
      if (this.particles) {
        this.particles.visible = false;
      }
      
      // Disable shadows
      this.renderer.shadowMap.enabled = false;
      
      // Reduce pixel ratio
      this.renderer.setPixelRatio(1);
      
      console.log('⚡ Performance mode activated');
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  /**
   * Update disaster state based on scroll and interaction
   */
  updateDisasterState() {
    // Change disaster type based on scroll position
    let targetDisaster = 'calm';
    
    if (this.scroll > 0.2) {
      targetDisaster = 'earthquake';
    } else if (this.scroll > 0.4) {
      targetDisaster = 'fire';
    } else if (this.scroll > 0.6) {
      targetDisaster = 'flood';
    }
    
    if (targetDisaster !== this.currentDisaster) {
      this.transitionToDisaster(targetDisaster);
    }
    
    // Apply mouse parallax
    if (this.camera) {
      const targetX = this.mouse.x * 0.5;
      const targetY = this.mouse.y * 0.3;
      
      this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
      this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
      this.camera.lookAt(0, 0, 0);
    }
  }
  
  /**
   * Transition to a different disaster state
   */
  transitionToDisaster(disasterType) {
    this.currentDisaster = disasterType;
    const disaster = this.disasters[disasterType];
    
    // Update particle system
    if (this.particles && disasterType !== 'calm') {
      this.particles.visible = true;
      this.updateParticles(disasterType);
    } else if (this.particles) {
      this.particles.visible = false;
    }
    
    // Update lighting
    if (this.lights.length > 2) {
      const pointLight = this.lights[2];
      pointLight.color.setHex(disaster.color);
      pointLight.intensity = disaster.intensity;
    }
    
    // Apply camera shake for earthquake
    if (disasterType === 'earthquake' && this.classroom) {
      const shakeIntensity = 0.02;
      this.classroom.rotation.x = (Math.random() - 0.5) * shakeIntensity;
      this.classroom.rotation.z = (Math.random() - 0.5) * shakeIntensity;
    } else if (this.classroom) {
      this.classroom.rotation.x = 0;
      this.classroom.rotation.z = 0;
    }
  }
  
  /**
   * Update particle system for different disasters
   */
  updateParticles(disasterType) {
    if (!this.particles) return;
    
    const positions = this.particles.geometry.attributes.position.array;
    const colors = this.particles.geometry.attributes.color.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      switch (disasterType) {
        case 'fire':
          // Fire embers - orange/red particles moving upward
          positions[i + 1] += 0.02; // Y movement
          colors[i] = 1; // R
          colors[i + 1] = 0.4; // G
          colors[i + 2] = 0; // B
          break;
          
        case 'flood':
          // Water droplets - blue particles falling
          positions[i + 1] -= 0.01; // Y movement
          colors[i] = 0.2; // R
          colors[i + 1] = 0.6; // G
          colors[i + 2] = 1; // B
          break;
          
        case 'earthquake':
          // Dust particles - gray particles dispersing
          positions[i] += (Math.random() - 0.5) * 0.01;
          positions[i + 2] += (Math.random() - 0.5) * 0.01;
          colors[i] = 0.5; // R
          colors[i + 1] = 0.5; // G
          colors[i + 2] = 0.5; // B
          break;
      }
      
      // Reset particles that go too far
      if (positions[i + 1] > 15) {
        positions[i + 1] = 0;
      } else if (positions[i + 1] < -2) {
        positions[i + 1] = 10;
      }
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.color.needsUpdate = true;
  }
  
  /**
   * Animation loop
   */
  animate() {
    if (!this.isAnimating) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    this.frameCount++;
    
    // Update scene state
    this.updateDisasterState();
    
    // Render the scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    
    // Continue animation loop
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    console.log('🗑️ Hero scene destroyed');
  }
}

// Initialize hero scene when Three.js is available
function initHeroScene() {
  if (typeof THREE !== 'undefined') {
    window.heroScene = new HeroScene();
  } else {
    console.warn('Three.js not loaded, using fallback');
    const canvas = document.getElementById('heroCanvas');
    const fallback = document.getElementById('heroFallback');
    
    if (canvas && fallback) {
      canvas.style.display = 'none';
      fallback.hidden = false;
    }
  }
}

// Initialize when DOM is ready and Three.js is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeroScene, 100); // Small delay to ensure Three.js is loaded
  });
} else {
  setTimeout(initHeroScene, 100);
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.heroScene) {
    window.heroScene.destroy();
  }
});