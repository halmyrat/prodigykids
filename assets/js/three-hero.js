(function () {
    var container = document.getElementById('three-hero');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.clientWidth;
    var h = container.clientHeight;

    // Scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f4ff);
    scene.fog = new THREE.FogExp2(0xe8f4ff, 0.04);

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
    var ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    var dirLight = new THREE.DirectionalLight(0x6ab4ff, 0.9);
    dirLight.position.set(3, 5, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    var fillLight = new THREE.DirectionalLight(0xffd080, 0.3);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Card geometry — slightly thick box for a physical card look
    var cardW = 2.7;
    var cardH = 1.7;
    var cardDepth = 0.04;
    var cardGeom = new THREE.BoxGeometry(cardW, cardH, cardDepth);

    // Shadow plane geometry (slightly larger, dark)
    var shadowGeom = new THREE.PlaneGeometry(cardW + 0.15, cardH + 0.15);

    var loader = new THREE.TextureLoader();
    var imageSrcs = [
        'assets/images/1.png',
        'assets/images/2.png',
        'assets/images/3.png'
    ];
    var xPositions = [-3.2, 0, 3.2];
    var yOffsets  = [0.15, -0.1, 0.2]; // slight height variation
    var cards = [];

    imageSrcs.forEach(function (src, i) {
        var group = new THREE.Group();

        // Soft drop-shadow plane behind the card
        var shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.18,
            depthWrite: false
        });
        var shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
        shadowPlane.position.set(0.08, -0.1, -cardDepth / 2 - 0.01);
        group.add(shadowPlane);

        // White card backing (edges visible as border)
        var backMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
        var back = new THREE.Mesh(cardGeom, backMat);
        group.add(back);

        // Image face
        var texture = loader.load(src);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // Front face only; reuse white for other sides
        var materials = [
            new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }), // right
            new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }), // left
            new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }), // top
            new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }), // bottom
            new THREE.MeshStandardMaterial({ map: texture }),     // front
            new THREE.MeshStandardMaterial({ color: 0xfafafa })   // back
        ];
        var front = new THREE.Mesh(cardGeom, materials);
        group.add(front);

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
            // Gentle floating bob — each card offset in phase
            g.position.y = item.baseY + Math.sin(t * 0.7 + i * 1.3) * 0.12;
            // Tilt toward mouse cursor
            g.rotation.y = mouse.x * 0.18 + Math.sin(t * 0.4 + i * 0.9) * 0.025;
            g.rotation.x = -mouse.y * 0.10 + Math.cos(t * 0.5 + i * 0.7) * 0.015;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', function () {
        var nw = container.clientWidth;
        var nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    });
}());
