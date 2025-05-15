jest.setTimeout(30000); // Default timeout for all tests

// Add custom matchers if needed
expect.extend({
    toBeValidColor(received) {
        const pass = /^rgba?\([\d\s,\.]+\)$/.test(received);
        return {
            message: () => `expected ${received} to be a valid CSS color`,
            pass
        };
    }
});
