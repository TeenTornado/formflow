import mongoose from 'mongoose';

const formElementSchema = new mongoose.Schema({
    id: String,
    type: {
        type: String,
        enum: [
            'shortText', 'longText', 'email', 'phone', 'address', 'website',
            'multipleChoice', 'dropdown', 'pictureChoice', 'yesNo', 'legal',
            'nps', 'opinionScale', 'rating', 'ranking', 'matrix', 'video'
        ],
        required: true
    },
    question: String,
    description: String,
    required: Boolean,
    options: [String],
    settings: mongoose.Schema.Types.Mixed
});

const formSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    description: String,
    elements: [formElementSchema],
    settings: {
        theme: String,
        showProgressBar: Boolean,
        enableKeyboardNavigation: Boolean
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    shareableLink: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

formSchema.pre('save', async function (next) {
    if (!this.shareableLink) {
        this.shareableLink = `${this.id}-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.updatedAt = new Date();
    next();
});

export const Form = mongoose.model('Form', formSchema);
