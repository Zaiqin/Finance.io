import { useEffect, useState } from "react";

interface OneCodeButtonProps {
    stationCode: string;
}

const OneCodeButton: React.FC<OneCodeButtonProps> = ({ stationCode }) => {
    console.log(stationCode)
    const [bg, setBg] = useState("#ffffff");
    const [text, setText] = useState("white");

    useEffect(() => {
        if (stationCode.includes("NS")) {
            setBg("#d42e12");
            setText("white");
        } else if (stationCode.includes("EW") || stationCode.includes("CG")) {
            setBg("#009645");
            setText("white");
        } else if (stationCode.includes("NE")) {
            setBg("#9900aa");
            setText("white");
        } else if (stationCode.includes("CC") || stationCode.includes("CE")) {
            setBg("#fa9e0d");
            setText("black");
        } else if (stationCode.includes("DT")) {
            setBg("#005ec4");
            setText("white");
        } else if (stationCode.includes("TE")) {
            setBg("#9D5B25");
            setText("white");
        } else if (
            stationCode.includes("BP") ||
            stationCode.includes("SE") ||
            stationCode.includes("SW") ||
            stationCode.includes("PE") ||
            stationCode.includes("PW") ||
            stationCode.includes("STC") ||
            stationCode.includes("PTC")
        ) {
            setBg("#748477");
            setText("white");
        } else if (stationCode.includes("CR") || stationCode.includes("CP")) {
            setBg("#97C616");
            setText("black");
        } else if (
            stationCode.includes("JS") ||
            stationCode.includes("JW") ||
            stationCode.includes("JE") ||
            stationCode.includes("JW")
        ) {
            setBg("#0099aa");
            setText("white");
        } else if (stationCode.includes("RTS")) {
            setBg("#87CEFA");
            setText("black");
        }
    }, [stationCode]);

    return (
        <button 
            className={`pointer-events-none font-bold ml-1 text-sm`} 
            style={{ 
                backgroundColor: bg, 
                color: text, 
                padding: '0.25rem 0.5rem', 
                marginBottom: '0.25rem', 
                borderRadius: '1rem',
                border: '2px solid white',
            }}>
            {stationCode}
        </button>
    );
};

interface ManyCodeButtonProps {
    stationCode: string;
}

const ManyCodeButton: React.FC<ManyCodeButtonProps> = ({ stationCode }) => {
    const [colors, setColors] = useState<string[]>([]);
    const [textColors, setTextColors] = useState<string[]>([]);

    useEffect(() => {
        const stationSegments = stationCode.split("/");
        const segmentColors = stationSegments.map((segment) => {
            if (segment.includes("NS")) {
                return "#d42e12";
            } else if (segment.includes("EW") || segment.includes("CG")) {
                return "#009645";
            } else if (segment.includes("NE")) {
                return "#9900aa";
            } else if (segment.includes("CC") || segment.includes("CE")) {
                return "#fa9e0d";
            } else if (segment.includes("DT")) {
                return "#005ec4";
            } else if (segment.includes("TE")) {
                return "#9D5B25";
            } else if (
                segment.includes("BP") ||
                segment.includes("SE") ||
                segment.includes("SW") ||
                segment.includes("PE") ||
                segment.includes("PW") ||
                segment.includes("STC") ||
                segment.includes("PTC")
            ) {
                return "#748477";
            } else if (segment.includes("CR") || segment.includes("CP")) {
                return "#97C616";
            } else if (
                segment.includes("JS") ||
                segment.includes("JW") ||
                segment.includes("JE") ||
                segment.includes("JW")
            ) {
                return "#0099aa";
            } else if (segment.includes("RTS")) {
                return "#87CEFA";
            }
            return "#ffffff";
        });
        const segmentTextColors = stationSegments.map((segment) => {
            if (
                segment.includes("CC") ||
                segment.includes("CE") ||
                segment.includes("CR") ||
                segment.includes("CP")
            ) {
                return "black";
            } else if (segment.includes("RTS")) {
                return "black";
            } else {
                return "white";
            }
        });
        setColors(segmentColors);
        setTextColors(segmentTextColors);
    }, [stationCode]);

    const segments = stationCode.split("/");

    return (
        <div className="inline-flex rounded-full shadow-sm mb-1 ml-1" role="group">
            {segments.map((segment, index) => (
            <button
                key={index}
                className={`pointer-events-none font-bold text-sm`}
                style={{
                backgroundColor: colors[index],
                color: textColors[index],
                padding: '0.25rem 0.5rem',
                borderRadius: index === 0 ? '1rem 0 0 1rem' : index === segments.length - 1 ? '0 1rem 1rem 0' : '0',
                borderLeft: index > 0 ? 'none' : '2px solid white',
                borderRight: index === segments.length - 1 ? '2px solid white' : 'none',
                borderTop: '2px solid white',
                borderBottom: '2px solid white'
            }}
            >
            {segment}
            </button>
            ))}
        </div>
    );
};

interface StationIconProps {
    stationCode: string;
}

const StationIcon: React.FC<StationIconProps> = ({ stationCode }) => {
    // Check if stationCode contains a '/'
    if (stationCode.includes("/")) {
        return <ManyCodeButton stationCode={stationCode} />;
    } else {
        return <OneCodeButton stationCode={stationCode} />;
    }
};

export default StationIcon;
