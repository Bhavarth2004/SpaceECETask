# SpaceECETask
This project is a high-performance, responsive multi-page web platform engineered for the SpaceECE India Foundation Web Development Internship recruitment portal.

#  SpaceECE India Foundation - Web Development Internship Portal

A high-performance, responsive, secure multi-page web application built with vanilla web technologies. This project is specifically architected to provide an exceptional user experience while applying modern frontend software engineering practices like localized data caching, rigorous defense-in-depth sanitization, and responsive adaptive design.

---

## 🛠️ Key Architectural Highlights & Engineering Innovations

To stand out from conventional layout structures, this project incorporates production-grade engineering mechanisms designed for modern web apps:

* ** XSS Anti-Injection Sanitization Guard:** Implements rigid input filtering using a character map abstraction layer (`&`, `<`, `>`, `"`, `'`, `/`) to stop Cross-Site Scripting vector targets right on the client side.
* ** Persistent Workspace Auto-Recovery:** Captures interactive typing changes in real time across the application form using `localStorage` handlers. If a browser crashes, reloads, or navigates away, the typed progress is instantly recovered.
* ** Asynchronous Lifecycle API Integration:** Connects seamlessly to a remote endpoint using native modern `async/await` JavaScript promises. The UI dynamically changes states with custom CSS animation parameters while processing payload requests.
* ** Unified State Theme Synchronization:** Features a smooth light and dark mode switch using structured CSS variables, maintaining strict accessibility metrics across layouts. System state preferences are saved locally across separate page routes.

---

##  Repository Structural Layout

The system divides layout rendering targets across explicit separate modular domains to ensure clean code management:

```text
├── index.html          # Portal home landing page with primary CTA pathways
├── about.html          # Detailed internship features and structure specifications
├── apply.html          # High-end interactive data collection form interface
├── style.css           # Global custom property theme configurations & responsive design breakpoints
└── script.js           # Consolidated application routing mechanics, verification, and API pipelines
