<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perspective: FGLIS 3D Journeys</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(45deg, #f3f4f6, #ddd);
        }
        h1, h2 {
            color: #2c3e50;
        }
        .logo {
            text-align: center;
            font-size: 3em;
            margin-bottom: 20px;
            animation: colorChange 5s infinite;
        }
        @keyframes colorChange {
            0% { color: #3498db; }
            50% { color: #e74c3c; }
            100% { color: #3498db; }
        }
        .feature {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-5px);
        }
        code {
            background: #f4f4f4;
            border-radius: 4px;
            padding: 2px 5px;
        }
        #viewCount {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <div id="viewCount">Views: <span id="count">0</span></div>

    <div class="logo">🌟 Perspective</div>

    <h1>Immersive 3D FGLIS Journeys</h1>

    <p>Perspective is a groundbreaking project showcasing the diverse paths of First-Generation Low-Income Students (FGLIS) through interactive 3D panoramic experiences. Our mission is to inspire, guide, and empower aspiring FGLIS by providing real-life examples and crucial information about college admissions, financial aid, and career trajectories in the United States.</p>

    <h2>🚀 Key Features</h2>

    <div class="feature">
        <h3>🔄 Multi-dimensional Views</h3>
        <p>Experience each FGLIS journey through four unique perspectives:</p>
        <ul>
            <li>💼 Work View</li>
            <li>🎓 School View</li>
            <li>📅 College Admissions Day View</li>
            <li>🏠 Home View</li>
        </ul>
    </div>

    <div class="feature">
        <h3>🌈 Immersive 3D Panoramas</h3>
        <p>Dive into 360-degree environments that bring each story to life, powered by cutting-edge WebGL technology.</p>
    </div>

    <div class="feature">
        <h3>💡 Inspirational Narratives</h3>
        <p>Explore the journeys of successful FGLIS who've overcome challenges in higher education and career development.</p>
    </div>

    <div class="feature">
        <h3>💰 Comprehensive Financial Aid Resources</h3>
        <p>Access a wealth of information on scholarships, grants, and financial aid opportunities tailored for FGLIS in the US.</p>
    </div>

    <div class="feature">
        <h3>🚀 Diverse Career Insights</h3>
        <p>Discover various career paths taken by FGLIS and gain valuable insights into different industries and professions.</p>
    </div>

    <h2>🛠️ Getting Started</h2>

    <ol>
        <li>Clone the repository:
            <br>
            <code>git clone https://github.com/your-username/perspective.git</code>
        </li>
        <li>Navigate to the project directory:
            <br>
            <code>cd perspective</code>
        </li>
        <li>Open <code>index.html</code> in your preferred web browser to start exploring the 3D panoramic experiences.</li>
    </ol>

    <h2>🤝 Contributing</h2>

    <p>We welcome contributions from the community! To add your own story:</p>

    <ol>
        <li>Clone the project</li>
        <li>Open the <code>pathsData.json</code> file</li>
        <li>Add your story following the existing format</li>
        <li>Submit a pull request with your changes</li>
    </ol>

    <p><strong>Note:</strong> Currently, we're using a local JSON file for data storage. We're actively working on implementing a cloud database solution to enhance scalability and real-time updates.</p>

    <h2>🔮 Future Enhancements</h2>

    <ul>
        <li>Cloud database integration for seamless story submissions and updates</li>
        <li>Mobile app for on-the-go access to inspiring FGLIS journeys</li>
        <li>AI-powered personalized pathway recommendations</li>
        <li>Virtual reality (VR) support for an even more immersive experience</li>
    </ul>

    <h2>📬 Contact Us</h2>

    <p>For questions, suggestions, or support, reach out to us:</p>
    <ul>
        <li>Email: support@perspective-fglis.com</li>
        <li>Twitter: @PerspectiveFGLIS</li>
        <li>Website: www.perspective-fglis.com</li>
    </ul>

    <footer>
        <p>Made with ❤️ by the Perspective Team</p>
    </footer>

    <script>
        // Simulating view count
        let views = 0;
        setInterval(() => {
            views += Math.floor(Math.random() * 10);
            document.getElementById('count').textContent = views;
        }, 5000);

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
