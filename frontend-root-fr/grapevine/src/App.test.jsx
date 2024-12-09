import { describe, test, expect} from "vitest";
import { render, screen} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Intro from "./pages/Intro";
import Messages from "./pages/Messages"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

describe("App Component Routing", () =>{
    test(('renders IntroPage on default route', () => {
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        );
        expect(screen.getByText(/Grapevine!/i)).toBeInTheDocument();
      })
    );
    test(('renders IntroPage login text on default route', () =>{
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText(/Log In/i))
        })
    );
    test(('renders IntroPage login text on default route', () =>{
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText(/Sign Up/i))
        })
    )    
})