import { Icon1, Icon2, Icon3, Icon4, Icon5 } from './Icons';
import "./NavBar.css";
const icons = [Icon1, Icon2, Icon3, Icon4];
/*
<nav className="nav-menu">
          <div className="nav-item active">
            <FaLocationArrow />
            <span>Location</span>
          </div>
          <div className="nav-item">
            <FaCamera />
            <span>Before</span>
          </div>
          <div className="nav-item">
            <FaCamera />
            <span>After</span>
          </div>
          <div className="nav-item">
            <FaClipboardList />
            <span>Summary</span>
          </div>
        </nav>
 */
const NavBar = ({ currentStep, enabledSteps, onStepChange, completedSteps }) => (
  <nav className="navbar flex justify-between">
    {icons.map((Icon, idx) => {
      const stepNumber = idx + 1;
      const isActive = currentStep === stepNumber;
      const isEnabled = enabledSteps.includes(stepNumber);

      
      return (
        <span
          key={idx}
          className={`icon ${isActive ? 'active' : 'deactive'} ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => isEnabled && onStepChange(stepNumber)}
        >
          <Icon active={isActive} />
        </span>
      );
    })}
  </nav>
);

export default NavBar;
