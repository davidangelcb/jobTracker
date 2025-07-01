import { Icon1, Icon2, Icon3, Icon4, Icon5 } from './Icons';

const icons = [Icon1, Icon2, Icon3, Icon4, Icon5];

const NavBar = ({ currentStep, enabledSteps, onStepChange }) => (
  <nav className="navbar flex justify-between">
    {icons.map((Icon, idx) => {
      const stepNumber = idx + 1;
      const isActive = currentStep === stepNumber;
      const isEnabled = enabledSteps.includes(stepNumber);

      return (
        <span
          key={idx}
          className={`icon ${isActive ? 'active' : ''} ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => isEnabled && onStepChange(stepNumber)}
        >
          <Icon active={isActive} />
        </span>
      );
    })}
  </nav>
);

export default NavBar;
