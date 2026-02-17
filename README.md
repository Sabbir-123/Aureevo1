# Aureevo — Premium Men's Fashion

Aureevo is a luxury e-commerce platform dedicated to high-end men's fashion. Built with modern web technologies, it offers a seamless shopping experience with a focus on aesthetic excellence, performance, and user engagement.

![Aureevo Banner](public/logo.png)

## 🚀 Features

### Customer Experience
- **Cinematic UI**: Immersive dark-mode first design with gold accents and smooth Framer Motion animations.
- **Dual Hero Section**: Dynamic landing page featuring separate collections for Clothing and Accessories.
- **Quick Add to Cart**: Interactive modal for selecting size, color, and quantity without leaving the page.
- **Theme Support**: Fully integrated Dark/Light mode toggle, respecting user preference.
- **Seamless Checkout**: Streamlined cart and checkout process.

### Admin Features
- **Dashboard**: Real-time overview of orders, revenue, and product stats.
- **Product Management**: Full CRUD capabilities for products, including image uploads (powered by Supabase Storage) and inventory management.
- **Order Management**: Track and update order statuses.
- **Secure Authentication**: Custom admin authentication system secure HTTP-only cookies.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: JavaScript
- **Styling**: CSS Modules (with CSS Variables for theming)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Sabbir-123/Aureevo1.git
    cd Aureevo1
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ADMIN_JWT_SECRET=your_jwt_secret
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/context`: Global context providers (e.g., ThemeContext).
- `/lib`: Utility functions and API clients.
- `/store`: Zustand state stores.
- `/public`: Static assets.

## 📄 License

This project is licensed under the MIT License.
