import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, PinIcon as Pinterest } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1b5e41] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-teal-400/20">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-xl font-bold">ServiceHub</span>
          </div>

          <div className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#2a6e51]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm">Call Us</p>
              <p>+91 9947774065</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#2a6e51]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm">Mail Us</p>
              <p>mail@serviceHub.com</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#2a6e51]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm">Location</p>
              <p>Calicut, 109-74</p>
            </div>
          </div>
        </div>

        <hr className="my-6 border-[#2a6e51]" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div>
            <p>
              Copyright ©{" "}
              <Link to="/" className="text-teal-300 hover:underline">
                ServiceHub
              </Link>{" "}
              | Designed by{" "}
              <Link to="/" className="text-teal-300 hover:underline">
                Siyad
              </Link>
            </p>
          </div>
          <div className="flex space-x-4">
            <p className="mr-2">Follow :</p>
            <Link to="/" aria-label="Instagram">
              <Instagram className="h-5 w-5 hover:text-teal-300" />
            </Link>
            <Link to="/" aria-label="Facebook">
              <Facebook className="h-5 w-5 hover:text-teal-300" />
            </Link>
            <Link to="/" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-teal-300" />
            </Link>
            <Link to="/" aria-label="Pinterest">
              <Pinterest className="h-5 w-5 hover:text-teal-300" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}