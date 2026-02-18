import { internalMutation } from "./_generated/server";

/**
 * Seed script for Aqoon AI database.
 *
 * Run with:  npx convex run seed:run
 *
 * Creates: 6 users, 6 courses, ~24 lessons, enrollments,
 * progress, quizzes, reviews, forum posts, notifications, messages, etc.
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		// Check if already seeded
		const existingUsers = await ctx.db.query("users").take(1);
		if (existingUsers.length > 0) {
			console.log("Database already seeded — skipping.");
			return "Already seeded";
		}

		const now = Date.now();

		// ─── Users ─────────────────────────────────────────────────────────
		const adminId = await ctx.db.insert("users", {
			name: "Abdirahman Hassan",
			email: "admin@aqoon.ai",
			role: "admin",
			bio: "Platform administrator and founder of Aqoon AI.",
			specialties: ["Platform Management", "Education Technology"],
			createdAt: now,
			updatedAt: now,
		});

		const tutor1Id = await ctx.db.insert("users", {
			name: "Fatima Ali",
			email: "fatima@aqoon.ai",
			role: "tutor",
			bio: "Senior web development instructor with 8 years of experience in React, Node.js, and modern JavaScript frameworks.",
			specialties: ["React", "Node.js", "TypeScript", "Next.js"],
			createdAt: now,
			updatedAt: now,
		});

		const tutor2Id = await ctx.db.insert("users", {
			name: "Mohamed Yusuf",
			email: "mohamed@aqoon.ai",
			role: "tutor",
			bio: "Data science and Python expert. Former ML engineer at a Fortune 500 company.",
			specialties: ["Python", "Machine Learning", "Data Science", "TensorFlow"],
			createdAt: now,
			updatedAt: now,
		});

		const student1Id = await ctx.db.insert("users", {
			name: "Amina Omar",
			email: "amina@example.com",
			role: "student",
			bio: "Computer science student eager to learn web development.",
			createdAt: now,
			updatedAt: now,
		});

		const student2Id = await ctx.db.insert("users", {
			name: "Yusuf Ibrahim",
			email: "yusuf@example.com",
			role: "student",
			bio: "Self-taught developer transitioning into tech.",
			createdAt: now,
			updatedAt: now,
		});

		const student3Id = await ctx.db.insert("users", {
			name: "Halima Ahmed",
			email: "halima@example.com",
			role: "student",
			bio: "Marketing professional learning data analysis.",
			createdAt: now,
			updatedAt: now,
		});

		// ─── Courses ───────────────────────────────────────────────────────
		const course1Id = await ctx.db.insert("courses", {
			title: "Complete React & Next.js Masterclass",
			description:
				"Master modern React development with hooks, server components, and Next.js App Router. Build real-world projects from scratch.",
			category: "Web Development",
			level: "intermediate",
			isPremium: true,
			priceCents: 4999,
			tutorId: tutor1Id,
			isPublished: true,
			createdAt: now - 30 * 86400000,
			updatedAt: now,
		});

		const course2Id = await ctx.db.insert("courses", {
			title: "TypeScript Fundamentals",
			description:
				"Learn TypeScript from zero to hero. Covers types, generics, utility types, and advanced patterns used in production codebases.",
			category: "Web Development",
			level: "beginner",
			isPremium: false,
			tutorId: tutor1Id,
			isPublished: true,
			createdAt: now - 25 * 86400000,
			updatedAt: now,
		});

		const course3Id = await ctx.db.insert("courses", {
			title: "Python for Data Science",
			description:
				"Comprehensive Python course covering NumPy, Pandas, Matplotlib, and Scikit-learn. Perfect for aspiring data scientists.",
			category: "Data Science",
			level: "beginner",
			isPremium: true,
			priceCents: 3999,
			tutorId: tutor2Id,
			isPublished: true,
			createdAt: now - 20 * 86400000,
			updatedAt: now,
		});

		const course4Id = await ctx.db.insert("courses", {
			title: "Machine Learning with TensorFlow",
			description:
				"Build and deploy machine learning models using TensorFlow and Keras. From neural networks to production deployment.",
			category: "Data Science",
			level: "advanced",
			isPremium: true,
			priceCents: 6999,
			tutorId: tutor2Id,
			isPublished: true,
			createdAt: now - 15 * 86400000,
			updatedAt: now,
		});

		const course5Id = await ctx.db.insert("courses", {
			title: "HTML & CSS for Beginners",
			description:
				"Start your web development journey with HTML5 and modern CSS. Learn responsive design, Flexbox, and Grid.",
			category: "Web Development",
			level: "beginner",
			isPremium: false,
			tutorId: tutor1Id,
			isPublished: true,
			createdAt: now - 10 * 86400000,
			updatedAt: now,
		});

		const course6Id = await ctx.db.insert("courses", {
			title: "Advanced Node.js Patterns",
			description:
				"Deep dive into Node.js internals, streaming, worker threads, and microservice architectures.",
			category: "Backend Development",
			level: "advanced",
			isPremium: true,
			priceCents: 5999,
			tutorId: tutor1Id,
			isPublished: false, // Draft course
			createdAt: now - 5 * 86400000,
			updatedAt: now,
		});

		// ─── Lessons ───────────────────────────────────────────────────────
		// Course 1: React & Next.js (5 lessons)
		const c1Lessons = [];
		const c1LessonData = [
			{
				title: "Introduction to React",
				content:
					"React is a JavaScript library for building user interfaces. In this lesson, we'll cover the fundamentals: JSX, components, and the virtual DOM.\n\n## What is React?\nReact was created by Facebook and is used by millions of developers worldwide. It uses a component-based architecture that makes building complex UIs manageable.\n\n## Key Concepts\n- **JSX**: A syntax extension that lets you write HTML-like code in JavaScript\n- **Components**: Reusable building blocks of your UI\n- **Virtual DOM**: React's efficient rendering mechanism",
				durationMinutes: 45,
				isPreview: true,
			},
			{
				title: "React Hooks Deep Dive",
				content:
					"Hooks are functions that let you use state and other React features without writing classes.\n\n## useState\nThe most fundamental hook for managing component state.\n\n## useEffect\nFor side effects like data fetching, subscriptions, and DOM manipulation.\n\n## Custom Hooks\nExtract reusable logic into custom hooks.",
				durationMinutes: 60,
				isPreview: false,
			},
			{
				title: "Server Components & Next.js App Router",
				content:
					"Next.js 14+ introduces the App Router with React Server Components.\n\n## Server vs Client Components\n- Server Components render on the server, reducing bundle size\n- Client Components handle interactivity\n\n## Data Fetching\n- `fetch` in Server Components with automatic caching\n- `useQuery` from Convex for reactive data",
				durationMinutes: 55,
				isPreview: false,
			},
			{
				title: "State Management Patterns",
				content:
					"Modern React state management beyond useState.\n\n## Context API\nFor app-wide state like themes and auth.\n\n## Zustand\nLightweight state management.\n\n## Server State\nUsing React Query or Convex's useQuery for server-synced state.",
				durationMinutes: 50,
				isPreview: false,
			},
			{
				title: "Building a Full-Stack Project",
				content:
					"Put everything together by building a real-world application.\n\n## Project Setup\nNext.js + Convex + Tailwind CSS.\n\n## Authentication\nImplementing sign-up, sign-in, and protected routes.\n\n## Deployment\nDeploy to Vercel with automatic CI/CD.",
				durationMinutes: 90,
				isPreview: false,
			},
		];
		for (let i = 0; i < c1LessonData.length; i++) {
			const id = await ctx.db.insert("lessons", {
				courseId: course1Id,
				title: c1LessonData[i].title,
				content: c1LessonData[i].content,
				orderIndex: i,
				durationMinutes: c1LessonData[i].durationMinutes,
				isPreview: c1LessonData[i].isPreview,
			});
			c1Lessons.push(id);
		}

		// Course 2: TypeScript (4 lessons)
		const c2Lessons = [];
		const c2LessonData = [
			{
				title: "TypeScript Basics",
				content:
					"TypeScript adds static types to JavaScript.\n\n## Why TypeScript?\n- Catch errors at compile time\n- Better IDE support\n- Self-documenting code\n\n## Basic Types\n`string`, `number`, `boolean`, `array`, `object`",
				durationMinutes: 40,
				isPreview: true,
			},
			{
				title: "Interfaces & Type Aliases",
				content:
					"Define shapes of objects with interfaces and type aliases.\n\n## Interfaces\nBest for object shapes and class contracts.\n\n## Type Aliases\nFor unions, intersections, and complex types.",
				durationMinutes: 45,
				isPreview: false,
			},
			{
				title: "Generics",
				content:
					"Write reusable, type-safe functions and classes.\n\n## Generic Functions\n```typescript\nfunction identity<T>(arg: T): T { return arg; }\n```\n\n## Generic Constraints\nLimit what types can be passed using `extends`.",
				durationMinutes: 50,
				isPreview: false,
			},
			{
				title: "Advanced Patterns",
				content:
					"Master advanced TypeScript patterns.\n\n## Mapped Types\nTransform existing types.\n\n## Conditional Types\nTypes that depend on conditions.\n\n## Template Literal Types\nPowerful string manipulation at the type level.",
				durationMinutes: 55,
				isPreview: false,
			},
		];
		for (let i = 0; i < c2LessonData.length; i++) {
			const id = await ctx.db.insert("lessons", {
				courseId: course2Id,
				title: c2LessonData[i].title,
				content: c2LessonData[i].content,
				orderIndex: i,
				durationMinutes: c2LessonData[i].durationMinutes,
				isPreview: c2LessonData[i].isPreview,
			});
			c2Lessons.push(id);
		}

		// Course 3: Python (4 lessons)
		const c3Lessons = [];
		const c3LessonData = [
			{
				title: "Python Fundamentals",
				content:
					"Get started with Python programming.\n\n## Variables & Data Types\nPython is dynamically typed with clear, readable syntax.\n\n## Control Flow\nif/elif/else, for loops, while loops.\n\n## Functions\nDefining and calling functions with def.",
				durationMinutes: 50,
				isPreview: true,
			},
			{
				title: "NumPy for Numerical Computing",
				content:
					"NumPy is the foundation of data science in Python.\n\n## Arrays\nEfficient numerical arrays with ndarray.\n\n## Operations\nVectorized operations, broadcasting, and linear algebra.",
				durationMinutes: 55,
				isPreview: false,
			},
			{
				title: "Pandas for Data Analysis",
				content:
					"Pandas provides powerful data manipulation tools.\n\n## DataFrames\nTabular data structure with labeled axes.\n\n## Data Cleaning\nHandling missing values, filtering, and transformation.",
				durationMinutes: 60,
				isPreview: false,
			},
			{
				title: "Data Visualization with Matplotlib",
				content:
					"Create compelling visualizations.\n\n## Basic Plots\nLine, bar, scatter, and histogram charts.\n\n## Customization\nColors, labels, legends, and styles.\n\n## Seaborn\nStatistical visualizations made easy.",
				durationMinutes: 45,
				isPreview: false,
			},
		];
		for (let i = 0; i < c3LessonData.length; i++) {
			const id = await ctx.db.insert("lessons", {
				courseId: course3Id,
				title: c3LessonData[i].title,
				content: c3LessonData[i].content,
				orderIndex: i,
				durationMinutes: c3LessonData[i].durationMinutes,
				isPreview: c3LessonData[i].isPreview,
			});
			c3Lessons.push(id);
		}

		// Course 4: ML with TensorFlow (4 lessons)
		const c4Lessons = [];
		const c4LessonData = [
			{
				title: "Introduction to Machine Learning",
				content:
					"Understanding the fundamentals of ML.\n\n## What is Machine Learning?\nTeaching computers to learn from data.\n\n## Types of ML\n- Supervised Learning\n- Unsupervised Learning\n- Reinforcement Learning",
				durationMinutes: 45,
				isPreview: true,
			},
			{
				title: "Neural Networks with Keras",
				content:
					"Build your first neural network.\n\n## Layers\nDense, convolutional, and recurrent layers.\n\n## Activation Functions\nReLU, sigmoid, softmax.",
				durationMinutes: 60,
				isPreview: false,
			},
			{
				title: "Training & Evaluation",
				content:
					"Train models effectively.\n\n## Loss Functions\nMSE, cross-entropy, custom losses.\n\n## Optimizers\nSGD, Adam, learning rate scheduling.\n\n## Metrics\nAccuracy, precision, recall, F1.",
				durationMinutes: 55,
				isPreview: false,
			},
			{
				title: "Model Deployment",
				content:
					"Deploy ML models to production.\n\n## TensorFlow Serving\nServe models via REST API.\n\n## TensorFlow.js\nRun models in the browser.\n\n## Cloud Deployment\nGCP, AWS, and Azure options.",
				durationMinutes: 50,
				isPreview: false,
			},
		];
		for (let i = 0; i < c4LessonData.length; i++) {
			const id = await ctx.db.insert("lessons", {
				courseId: course4Id,
				title: c4LessonData[i].title,
				content: c4LessonData[i].content,
				orderIndex: i,
				durationMinutes: c4LessonData[i].durationMinutes,
				isPreview: c4LessonData[i].isPreview,
			});
			c4Lessons.push(id);
		}

		// Course 5: HTML & CSS (3 lessons)
		const c5Lessons = [];
		const c5LessonData = [
			{
				title: "HTML5 Structure & Semantics",
				content:
					"Learn the building blocks of the web.\n\n## Document Structure\nDOCTYPE, head, body, and semantic elements.\n\n## Common Elements\nHeadings, paragraphs, links, images, forms.",
				durationMinutes: 35,
				isPreview: true,
			},
			{
				title: "CSS Fundamentals & Flexbox",
				content:
					"Style your web pages beautifully.\n\n## Selectors & Properties\nClass, ID, element selectors.\n\n## Flexbox\nOne-dimensional layout system for responsive designs.",
				durationMinutes: 40,
				isPreview: false,
			},
			{
				title: "CSS Grid & Responsive Design",
				content:
					"Create modern layouts.\n\n## CSS Grid\nTwo-dimensional layout system.\n\n## Media Queries\nAdapt your design to different screen sizes.\n\n## Mobile-First Approach\nStart with mobile, enhance for larger screens.",
				durationMinutes: 45,
				isPreview: false,
			},
		];
		for (let i = 0; i < c5LessonData.length; i++) {
			const id = await ctx.db.insert("lessons", {
				courseId: course5Id,
				title: c5LessonData[i].title,
				content: c5LessonData[i].content,
				orderIndex: i,
				durationMinutes: c5LessonData[i].durationMinutes,
				isPreview: c5LessonData[i].isPreview,
			});
			c5Lessons.push(id);
		}

		// ─── Enrollments ───────────────────────────────────────────────────
		// Student 1: enrolled in courses 1, 2, 5
		await ctx.db.insert("enrollments", {
			userId: student1Id,
			courseId: course1Id,
			enrolledAt: now - 20 * 86400000,
			status: "active",
		});
		await ctx.db.insert("enrollments", {
			userId: student1Id,
			courseId: course2Id,
			enrolledAt: now - 18 * 86400000,
			completedAt: now - 3 * 86400000,
			status: "completed",
		});
		await ctx.db.insert("enrollments", {
			userId: student1Id,
			courseId: course5Id,
			enrolledAt: now - 8 * 86400000,
			status: "active",
		});

		// Student 2: enrolled in courses 1, 3
		await ctx.db.insert("enrollments", {
			userId: student2Id,
			courseId: course1Id,
			enrolledAt: now - 15 * 86400000,
			status: "active",
		});
		await ctx.db.insert("enrollments", {
			userId: student2Id,
			courseId: course3Id,
			enrolledAt: now - 12 * 86400000,
			status: "active",
		});

		// Student 3: enrolled in courses 3, 4, 5
		await ctx.db.insert("enrollments", {
			userId: student3Id,
			courseId: course3Id,
			enrolledAt: now - 14 * 86400000,
			status: "active",
		});
		await ctx.db.insert("enrollments", {
			userId: student3Id,
			courseId: course4Id,
			enrolledAt: now - 10 * 86400000,
			status: "active",
		});
		await ctx.db.insert("enrollments", {
			userId: student3Id,
			courseId: course5Id,
			enrolledAt: now - 7 * 86400000,
			completedAt: now - 1 * 86400000,
			status: "completed",
		});

		// ─── Lesson Progress ───────────────────────────────────────────────
		// Student 1: completed first 3 lessons of course 1
		for (let i = 0; i < 3; i++) {
			await ctx.db.insert("lessonProgress", {
				userId: student1Id,
				lessonId: c1Lessons[i],
				completed: true,
				completedAt: now - (15 - i * 3) * 86400000,
			});
		}
		// Student 1: completed all TypeScript lessons
		for (let i = 0; i < c2Lessons.length; i++) {
			await ctx.db.insert("lessonProgress", {
				userId: student1Id,
				lessonId: c2Lessons[i],
				completed: true,
				completedAt: now - (10 - i * 2) * 86400000,
			});
		}
		// Student 2: completed first 2 lessons of course 1
		for (let i = 0; i < 2; i++) {
			await ctx.db.insert("lessonProgress", {
				userId: student2Id,
				lessonId: c1Lessons[i],
				completed: true,
				completedAt: now - (10 - i * 3) * 86400000,
			});
		}
		// Student 3: completed all HTML & CSS lessons
		for (let i = 0; i < c5Lessons.length; i++) {
			await ctx.db.insert("lessonProgress", {
				userId: student3Id,
				lessonId: c5Lessons[i],
				completed: true,
				completedAt: now - (5 - i) * 86400000,
			});
		}

		// ─── Quizzes ───────────────────────────────────────────────────────
		// Quiz for Course 1, Lesson 1
		const quiz1Id = await ctx.db.insert("quizzes", {
			lessonId: c1Lessons[0],
			title: "React Fundamentals Quiz",
			questions: [
				{
					question: "What is JSX?",
					options: [
						"A database query language",
						"A syntax extension for JavaScript",
						"A CSS framework",
						"A testing library",
					],
					correctOptionIndex: 1,
					explanation:
						"JSX is a syntax extension that allows you to write HTML-like code inside JavaScript.",
				},
				{
					question: "What is the Virtual DOM?",
					options: [
						"A real DOM element",
						"A lightweight copy of the actual DOM",
						"A CSS selector engine",
						"A browser API",
					],
					correctOptionIndex: 1,
					explanation:
						"The Virtual DOM is a lightweight JavaScript representation of the actual DOM, used by React for efficient rendering.",
				},
				{
					question:
						"Which hook is used for managing component state in functional components?",
					options: ["useEffect", "useContext", "useState", "useRef"],
					correctOptionIndex: 2,
					explanation:
						"useState is the primary hook for managing local component state.",
				},
			],
		});

		// Quiz for Course 2, Lesson 1
		const quiz2Id = await ctx.db.insert("quizzes", {
			lessonId: c2Lessons[0],
			title: "TypeScript Basics Quiz",
			questions: [
				{
					question: "What does TypeScript add to JavaScript?",
					options: [
						"Runtime performance",
						"Static type checking",
						"Database support",
						"CSS styling",
					],
					correctOptionIndex: 1,
					explanation:
						"TypeScript is a superset of JavaScript that adds static type checking.",
				},
				{
					question: "How do you define a variable with a specific type?",
					options: [
						"let x = number",
						"let x: number",
						"let number x",
						"number let x",
					],
					correctOptionIndex: 1,
					explanation: "TypeScript uses the colon syntax: `let x: number`",
				},
				{
					question: "What is the `any` type?",
					options: [
						"The strictest type",
						"A type that only accepts strings",
						"A type that accepts any value",
						"A type for arrays only",
					],
					correctOptionIndex: 2,
					explanation:
						"The `any` type disables type checking for that variable, accepting any value.",
				},
			],
		});

		// Quiz for Course 3, Lesson 1
		await ctx.db.insert("quizzes", {
			lessonId: c3Lessons[0],
			title: "Python Basics Quiz",
			questions: [
				{
					question: "How do you define a function in Python?",
					options: [
						"function myFunc()",
						"def myFunc():",
						"fn myFunc()",
						"func myFunc()",
					],
					correctOptionIndex: 1,
					explanation:
						"Python uses the `def` keyword to define functions.",
				},
				{
					question: "What is Python's indentation used for?",
					options: [
						"Decoration only",
						"Defining code blocks",
						"Comments",
						"Variable naming",
					],
					correctOptionIndex: 1,
					explanation:
						"Python uses indentation to define code blocks instead of braces.",
				},
			],
		});

		// ─── Quiz Attempts ─────────────────────────────────────────────────
		// Student 1 took quiz 1 and quiz 2
		await ctx.db.insert("quizAttempts", {
			quizId: quiz1Id,
			userId: student1Id,
			answers: [1, 1, 2],
			score: 100,
			feedback: "Perfect score! You have a great understanding of React fundamentals.",
			completedAt: now - 14 * 86400000,
		});
		await ctx.db.insert("quizAttempts", {
			quizId: quiz2Id,
			userId: student1Id,
			answers: [1, 1, 2],
			score: 100,
			feedback: "Excellent! You've mastered the TypeScript basics.",
			completedAt: now - 8 * 86400000,
		});
		// Student 2 took quiz 1
		await ctx.db.insert("quizAttempts", {
			quizId: quiz1Id,
			userId: student2Id,
			answers: [1, 0, 2],
			score: 67,
			feedback: "Good attempt! Review the Virtual DOM concept.",
			completedAt: now - 9 * 86400000,
		});

		// ─── Reviews ───────────────────────────────────────────────────────
		await ctx.db.insert("reviews", {
			userId: student1Id,
			courseId: course1Id,
			rating: 5,
			comment:
				"Incredible course! Fatima explains complex concepts clearly. The project-based approach really solidified my understanding.",
			createdAt: now - 10 * 86400000,
		});
		await ctx.db.insert("reviews", {
			userId: student2Id,
			courseId: course1Id,
			rating: 4,
			comment:
				"Very comprehensive. Would love more exercises between lessons.",
			createdAt: now - 7 * 86400000,
		});
		await ctx.db.insert("reviews", {
			userId: student1Id,
			courseId: course2Id,
			rating: 5,
			comment:
				"Best TypeScript course I've taken. The generics section was especially helpful.",
			createdAt: now - 3 * 86400000,
		});
		await ctx.db.insert("reviews", {
			userId: student3Id,
			courseId: course3Id,
			rating: 4,
			comment:
				"Great introduction to data science. Mohamed is a fantastic teacher.",
			createdAt: now - 8 * 86400000,
		});
		await ctx.db.insert("reviews", {
			userId: student2Id,
			courseId: course3Id,
			rating: 5,
			comment:
				"The Pandas section alone is worth it. Very practical and well-paced.",
			createdAt: now - 5 * 86400000,
		});
		await ctx.db.insert("reviews", {
			userId: student3Id,
			courseId: course5Id,
			rating: 5,
			comment:
				"Perfect for beginners! I went from knowing nothing to building responsive pages.",
			createdAt: now - 1 * 86400000,
		});

		// ─── Wishlist ──────────────────────────────────────────────────────
		await ctx.db.insert("wishlist", {
			userId: student1Id,
			courseId: course3Id,
			addedAt: now - 5 * 86400000,
		});
		await ctx.db.insert("wishlist", {
			userId: student1Id,
			courseId: course4Id,
			addedAt: now - 3 * 86400000,
		});
		await ctx.db.insert("wishlist", {
			userId: student2Id,
			courseId: course4Id,
			addedAt: now - 2 * 86400000,
		});

		// ─── Certificates ──────────────────────────────────────────────────
		await ctx.db.insert("certificates", {
			userId: student1Id,
			courseId: course2Id,
			issuedAt: now - 3 * 86400000,
			certificateUrl: "https://aqoon.ai/certificates/CERT-TS-001",
			code: "CERT-TS-001",
		});
		await ctx.db.insert("certificates", {
			userId: student3Id,
			courseId: course5Id,
			issuedAt: now - 1 * 86400000,
			certificateUrl: "https://aqoon.ai/certificates/CERT-HTML-001",
			code: "CERT-HTML-001",
		});

		// ─── Forum Posts ───────────────────────────────────────────────────
		const post1Id = await ctx.db.insert("forumPosts", {
			courseId: course1Id,
			userId: student1Id,
			title: "Best practices for organizing React components?",
			content:
				"I'm building a large app and wondering about the recommended folder structure. Should I group by feature or by type (components, hooks, utils)?",
			createdAt: now - 8 * 86400000,
		});
		const post2Id = await ctx.db.insert("forumPosts", {
			courseId: course1Id,
			userId: student2Id,
			title: "Server Components vs Client Components confusion",
			content:
				"I'm having trouble understanding when to use 'use client'. Can someone explain the mental model?",
			createdAt: now - 5 * 86400000,
		});
		await ctx.db.insert("forumPosts", {
			courseId: course3Id,
			userId: student3Id,
			title: "Recommended datasets for practice?",
			content:
				"After completing the Pandas lesson, I want to practice more. Any good datasets for beginners?",
			createdAt: now - 4 * 86400000,
		});

		// ─── Forum Replies ─────────────────────────────────────────────────
		await ctx.db.insert("forumReplies", {
			postId: post1Id,
			userId: tutor1Id,
			content:
				"Great question! I recommend grouping by feature for larger apps. Each feature folder contains its components, hooks, and utilities. This makes it easy to find related code and move features around.",
			createdAt: now - 7 * 86400000,
		});
		await ctx.db.insert("forumReplies", {
			postId: post1Id,
			userId: student2Id,
			content:
				"I've been using the feature-based approach too and it works great. Also check out the Next.js App Router convention with route groups!",
			createdAt: now - 6 * 86400000,
		});
		await ctx.db.insert("forumReplies", {
			postId: post2Id,
			userId: tutor1Id,
			content:
				"Think of it this way: if a component needs interactivity (state, effects, event handlers), it needs 'use client'. Otherwise, keep it as a Server Component for better performance. I'll cover this in more depth in the next lesson!",
			createdAt: now - 4 * 86400000,
		});

		// ─── Notifications ─────────────────────────────────────────────────
		await ctx.db.insert("notifications", {
			userId: student1Id,
			type: "enrollment",
			title: "Welcome to React & Next.js!",
			message:
				"You've been enrolled in 'Complete React & Next.js Masterclass'. Start learning now!",
			isRead: true,
			link: "/student/learn/" + course1Id,
			createdAt: now - 20 * 86400000,
		});
		await ctx.db.insert("notifications", {
			userId: student1Id,
			type: "quiz_result",
			title: "Quiz Passed!",
			message: "You scored 100% on 'React Fundamentals Quiz'. Great job!",
			isRead: true,
			link: "/student/quiz-results/" + quiz1Id,
			createdAt: now - 14 * 86400000,
		});
		await ctx.db.insert("notifications", {
			userId: student1Id,
			type: "certificate",
			title: "Certificate Earned!",
			message:
				"Congratulations! You've earned a certificate for completing 'TypeScript Fundamentals'.",
			isRead: false,
			link: "/student/certificates",
			createdAt: now - 3 * 86400000,
		});
		await ctx.db.insert("notifications", {
			userId: student1Id,
			type: "forum_reply",
			title: "New reply to your post",
			message:
				"Fatima Ali replied to 'Best practices for organizing React components?'",
			isRead: false,
			link: "/student/courses/" + course1Id + "/forum",
			createdAt: now - 7 * 86400000,
		});
		await ctx.db.insert("notifications", {
			userId: student2Id,
			type: "enrollment",
			title: "Welcome to Python for Data Science!",
			message:
				"You've been enrolled in 'Python for Data Science'. Start learning now!",
			isRead: false,
			link: "/student/learn/" + course3Id,
			createdAt: now - 12 * 86400000,
		});
		await ctx.db.insert("notifications", {
			userId: student3Id,
			type: "certificate",
			title: "Certificate Earned!",
			message:
				"Congratulations! You've earned a certificate for completing 'HTML & CSS for Beginners'.",
			isRead: false,
			link: "/student/certificates",
			createdAt: now - 1 * 86400000,
		});

		// ─── Messages ──────────────────────────────────────────────────────
		await ctx.db.insert("messages", {
			senderId: student1Id,
			receiverId: tutor1Id,
			content:
				"Hi Fatima! I had a question about the project in lesson 5. Can I use a different database instead of Convex?",
			isRead: true,
			createdAt: now - 6 * 86400000,
		});
		await ctx.db.insert("messages", {
			senderId: tutor1Id,
			receiverId: student1Id,
			content:
				"Hi Amina! Great question. Yes, you can use any backend you like for the project. However, I recommend sticking with Convex since it integrates seamlessly with Next.js. Let me know if you need help!",
			isRead: true,
			createdAt: now - 5 * 86400000,
		});
		await ctx.db.insert("messages", {
			senderId: student1Id,
			receiverId: tutor1Id,
			content:
				"Thanks for the advice! I'll go with Convex then. One more thing — do you have any recommended resources for learning about real-time subscriptions?",
			isRead: false,
			createdAt: now - 4 * 86400000,
		});
		await ctx.db.insert("messages", {
			senderId: student2Id,
			receiverId: tutor2Id,
			content:
				"Mohamed, the numpy lesson was amazing! Could you recommend some extra practice exercises?",
			isRead: true,
			createdAt: now - 3 * 86400000,
		});
		await ctx.db.insert("messages", {
			senderId: tutor2Id,
			receiverId: student2Id,
			content:
				"Thanks Yusuf! I'm glad you enjoyed it. Check out numpy.org/learn for official tutorials, and try the exercises on HackerRank's numpy track.",
			isRead: false,
			createdAt: now - 2 * 86400000,
		});

		// ─── Payments ──────────────────────────────────────────────────────
		await ctx.db.insert("payments", {
			userId: student1Id,
			courseId: course1Id,
			amountCents: 4999,
			stripePaymentId: "pi_seed_001",
			status: "succeeded",
			createdAt: now - 20 * 86400000,
		});
		await ctx.db.insert("payments", {
			userId: student2Id,
			courseId: course3Id,
			amountCents: 3999,
			stripePaymentId: "pi_seed_002",
			status: "succeeded",
			createdAt: now - 12 * 86400000,
		});
		await ctx.db.insert("payments", {
			userId: student3Id,
			courseId: course3Id,
			amountCents: 3999,
			stripePaymentId: "pi_seed_003",
			status: "succeeded",
			createdAt: now - 14 * 86400000,
		});
		await ctx.db.insert("payments", {
			userId: student3Id,
			courseId: course4Id,
			amountCents: 6999,
			stripePaymentId: "pi_seed_004",
			status: "succeeded",
			createdAt: now - 10 * 86400000,
		});

		// ─── Payouts ───────────────────────────────────────────────────────
		await ctx.db.insert("payouts", {
			tutorId: tutor1Id,
			amountCents: 3500,
			stripeTransferId: "tr_seed_001",
			status: "paid",
			processedAt: now - 15 * 86400000,
		});
		await ctx.db.insert("payouts", {
			tutorId: tutor2Id,
			amountCents: 5600,
			stripeTransferId: "tr_seed_002",
			status: "paid",
			processedAt: now - 10 * 86400000,
		});
		await ctx.db.insert("payouts", {
			tutorId: tutor2Id,
			amountCents: 4900,
			stripeTransferId: "tr_seed_003",
			status: "pending",
			processedAt: now - 2 * 86400000,
		});

		console.log("✅ Database seeded successfully!");
		console.log("Created: 6 users, 6 courses, 20 lessons, 8 enrollments");
		console.log("Quiz, reviews, forum posts, notifications, messages, payments");

		return "Seed complete";
	},
});
