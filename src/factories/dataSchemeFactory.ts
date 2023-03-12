import Dictionary from "../general/dictionary";
import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

export default function (dataFolder: Dictionary<any>): Dictionary<any> {
    const schemes = new Dictionary<any>();
    Object.entries(dataFolder).forEach(([dataName, dataDefinition]) => {
        schemes[dataName] = new Scheme({ ...dataDefinition, _id: false });
    });
    return schemes;
}