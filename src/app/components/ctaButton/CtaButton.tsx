import './CtaButton.css';

interface CtaButtonProps {
    label: string;
    isDisabled: boolean;
    actionFn: Function;
}

export default function CtaButton(props : CtaButtonProps) {
  return (
    <button
      className="cta-button"
      type='button'
      disabled={props.isDisabled}
      onClick={() => props.actionFn()}>
      
        {props.label}
    </button>
  );
}
