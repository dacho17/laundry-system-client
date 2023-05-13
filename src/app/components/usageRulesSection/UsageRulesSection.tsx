import CONSTANTS from "../../../assets/constants";

export default function UsageRulesSection() {

    return <div className='section-text-rows'>
        <div className='section-title margin-bottom-3'>
            {CONSTANTS.rulesOnUseLabel}
        </div>
        {CONSTANTS.rulesOnUse.map((rule: string, index: number) => {
            return <div 
                key={index}
                className='section-text margin-bottom-1'>
                {rule}
            </div>
        })}
    </div>
}
