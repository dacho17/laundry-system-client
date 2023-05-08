import './SectionNavigator.css';

interface SectionNavigatorProps {
    sectionLabels: string[];
    currentlyActiveSection: number;
    setActiveSectionFn: Function;
}

export default function SectionNavigator(props: SectionNavigatorProps) {
    return (
        <div id='section-navigator'>
            {props.sectionLabels.map((label, index) => {
                const className = `section-navigator__link ${index === props.currentlyActiveSection ? 'active' : ''}`
                return <div
                    className={className}
                    key={`${className}-${index}`}
                    onClick={() => props.setActiveSectionFn(index)}
                >{label}</div>
            })}

        </div>
    )
}
