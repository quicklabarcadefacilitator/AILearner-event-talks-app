const talksData = [
    {
        id: 'talk1',
        title: "The Future of Serverless Architectures",
        speakers: ["Dr. Alex W."],
        category: ["Cloud Computing", "Architecture"],
        duration: 60, // minutes
        description: "Explore the latest trends and best practices in serverless computing, focusing on cost optimization and scalability."
    },
    {
        id: 'talk2',
        title: "Mastering TypeScript for Large Scale Applications",
        speakers: ["Ms. Jordan S."],
        category: ["Web Development", "Programming Languages"],
        duration: 60,
        description: "Dive deep into advanced TypeScript features that can help you build robust and maintainable applications."
    },
    {
        id: 'talk3',
        title: "Introduction to Quantum Machine Learning",
        speakers: ["Dr. Evelyn K.", "Mr. Chris P."],
        category: ["AI", "Machine Learning", "Quantum Computing"],
        duration: 60,
        description: "An accessible introduction to the exciting field of quantum machine learning and its potential impact."
    },
    {
        id: 'talk4',
        title: "DevOps with Kubernetes: A Practical Guide",
        speakers: ["Mr. Michael B."],
        category: ["DevOps", "Cloud Computing"],
        duration: 60,
        description: "Learn how to effectively deploy, manage, and scale your applications using Kubernetes in a DevOps pipeline."
    },
    {
        id: 'talk5',
        title: "Building Real-time Applications with WebSockets",
        speakers: ["Ms. Olivia R."],
        category: ["Web Development", "Networking"],
        duration: 60,
        description: "Discover how to implement real-time communication in your web applications using WebSockets."
    },
    {
        id: 'talk6',
        title: "Ethical AI: Principles and Practices",
        speakers: ["Dr. Benjamin H."],
        category: ["AI", "Ethics"],
        duration: 60,
        description: "Discussing the ethical considerations in AI development and deployment, and how to build responsible AI systems."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const categoryFilter = document.getElementById('category-filter');

    // Populate category filter
    const allCategories = new Set();
    talksData.forEach(talk => {
        talk.category.forEach(cat => allCategories.add(cat));
    });
    Array.from(allCategories).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderSchedule(filteredTalks) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        const schedule = [];
        let talkIndex = 0;

        // Add talks and manage lunch break
        while (talkIndex < filteredTalks.length) {
            const talk = filteredTalks[talkIndex];

            // Check if it's time for lunch (after 3 talks)
            if (talkIndex === 3 && filteredTalks.length > 3) {
                const lunchStartTime = new Date(currentTime.getTime());
                schedule.push({
                    type: 'break',
                    title: 'Lunch Break',
                    startTime: lunchStartTime,
                    endTime: new Date(lunchStartTime.getTime() + (60 * 60 * 1000)), // 1 hour
                    description: 'Enjoy a delicious lunch!',
                    id: 'lunch-break'
                });
                currentTime = new Date(lunchStartTime.getTime() + (60 * 60 * 1000)); // Advance time by 1 hour for lunch
            }

            const talkStartTime = new Date(currentTime.getTime());
            const talkEndTime = new Date(talkStartTime.getTime() + (talk.duration * 60 * 1000));

            schedule.push({
                type: 'talk',
                ...talk,
                startTime: talkStartTime,
                endTime: talkEndTime
            });

            currentTime = new Date(talkEndTime.getTime());

            // Add transition time if it's not the last talk
            if (talkIndex < filteredTalks.length - 1) {
                currentTime = new Date(currentTime.getTime() + (10 * 60 * 1000)); // Add 10 minutes transition
            }
            talkIndex++;
        }

        // Render schedule items
        schedule.forEach(item => {
            if (item.type === 'talk') {
                const talkCard = document.createElement('div');
                talkCard.className = 'talk-card';
                talkCard.innerHTML = `
                    <div class="talk-time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                    <h2>${item.title}</h2>
                    <div class="talk-speakers">Speaker(s): ${item.speakers.join(', ')}</div>
                    <div class="talk-categories">Categories: ${item.category.join(', ')}</div>
                    <p class="talk-description">${item.description}</p>
                `;
                scheduleContainer.appendChild(talkCard);
            } else if (item.type === 'break') {
                const breakCard = document.createElement('div');
                breakCard.className = 'break-card';
                breakCard.innerHTML = `
                    <div class="break-time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                    <h2>${item.title}</h2>
                    <p class="break-description">${item.description}</p>
                `;
                scheduleContainer.appendChild(breakCard);
            }
        });
    }

    // Initial render
    renderSchedule(talksData);

    // Filter functionality
    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === 'all') {
            renderSchedule(talksData);
        } else {
            const filteredTalks = talksData.filter(talk =>
                talk.category.includes(selectedCategory)
            );
            renderSchedule(filteredTalks);
        }
    });
});
