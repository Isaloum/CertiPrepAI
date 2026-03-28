import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>
          Built with ☁️ by AWSPrepAI &nbsp;|&nbsp;
          <a href="https://github.com/Isaloum/AWSPrepAI" className="text-blue-400 hover:text-blue-300">GitHub</a>
          &nbsp;|&nbsp;
          <a href="mailto:support@awsprepai.com" className="text-blue-400 hover:text-blue-300">support@awsprepai.com</a>
          &nbsp;|&nbsp;
          <Link to="/terms.pdf" className="text-blue-400 hover:text-blue-300">Terms & Privacy</Link>
        </p>
        <p className="mt-1 text-xs text-gray-500">© {new Date().getFullYear()} AWSPrepAI · Not affiliated with Amazon Web Services</p>
      </div>
    </footer>
  )
}
