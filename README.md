# 3D Time Optimizer – Life Calendar

A revolutionary 3D life visualization tool that helps you see your time, understand your habits, and optimize your future with data-driven insights.

## Features

- **3D Life Visualization**: See your entire life as an interactive 3D grid
- **Time Optimization**: Simulate how small daily changes impact your lifetime
- **Smart Calendar**: Plan your days, weeks, and years with intelligent scheduling
- **Goal Tracking**: Set and track meaningful goals with visual progress
- **Advanced Search**: Find anything across your entire life timeline
- **Notes & Reminders**: Keep track of thoughts and get timely notifications
- **Data Persistence**: Secure cloud storage with Supabase

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account for data storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3d-time-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/create_complete_schema.sql`
   - Enable Row Level Security (RLS) on all tables

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

### Key Components
- **LifeGrid3D**: Interactive 3D visualization of your life timeline
- **ControlPanel**: Time allocation and goal simulation tools
- **GlobalSearch**: Advanced search across all your data
- **CalendarView**: Comprehensive calendar and scheduling interface
- **YearView**: Detailed year planning and task management

## Database Schema

The app uses four main tables:
- `user_profiles`: User account information
- `life_data`: Core life metrics and activity allocations
- `time_data`: Detailed scheduling and goal data by year
- `notes`: Personal notes and thoughts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.