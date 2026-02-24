(function () {
    var container = document.getElementById('three-hero');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.clientWidth;
    var h = container.clientHeight;

    // Scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f4ff);
    scene.fog = new THREE.FogExp2(0xe8f4ff, 0.035);

    // Camera
    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    var ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    var dirLight = new THREE.DirectionalLight(0x6ab4ff, 0.85);
    dirLight.position.set(3, 5, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    var fillLight = new THREE.DirectionalLight(0xffd080, 0.3);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // App-icon proportions — square with slight thickness
    var iconSize = 1.8;   // square icons
    var cardDepth = 0.12; // thicker depth for chunky icon feel
    var cardGeom = new THREE.BoxGeometry(iconSize, iconSize, cardDepth);

    // Shadow plane (slightly larger, offset behind)
    var shadowGeom = new THREE.PlaneGeometry(iconSize + 0.2, iconSize + 0.2);

    var loader = new THREE.TextureLoader();

    // Use app icon / cover images instead of wide screenshots
    var imageSrcs = [
        'assets/images/logo.png',
        'assets/images/nutcracker.jpg',
        'assets/images/banners/mini_BookCover.jpg'
    ];

    var xPositions = [-2.8, 0, 2.8];
    var yOffsets   = [0.1, -0.15, 0.1];
    var cards = [];

    imageSrcs.forEach(function (src, i) {
        var group = new THREE.Group();

        // Soft drop-shadow plane behind the icon
        var shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.20,
            depthWrite: false
        });
        var shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
        shadowPlane.position.set(0.07, -0.09, -cardDepth / 2 - 0.01);
        group.add(shadowPlane);

        // Load icon texture
        var texture = loader.load(src);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        // Per-face materials: icon on front, soft rounded-white on edges/back
        var edgeColor = 0xffffff;
        var materials = [
            new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.5 }), // right
            new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.5 }), // left
            new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.5 }), // top
            new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.5 }), // bottom
            new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3 }),      // front (icon)
            new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 })   // back
        ];

        var icon = new THREE.Mesh(cardGeom, materials);
        group.add(icon);

        group.position.set(xPositions[i], yOffsets[i], 0);
        scene.add(group);
        cards.push({ group: group, baseY: yOffsets[i] });
    });

    // Mouse tracking
    var mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();

        cards.forEach(function (item, i) {
            var g = item.group;
            // Gentle floating bob with staggered phase
            g.position.y = item.baseY + Math.sin(t * 0.7 + i * 1.3) * 0.13;
            // Subtle tilt toward mouse
            g.rotation.y = mouse.x * 0.20 + Math.sin(t * 0.4 + i * 0.9) * 0.03;
            g.rotation.x = -mouse.y * 0.12 + Math.cos(t * 0.5 + i * 0.7) * 0.02;
            // Gentle idle spin nudge
            g.rotation.z = Math.sin(t * 0.3 + i * 2.1) * 0.018;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', function () {
        var nw = container.clientWidth;
        var nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    });
}());
