using FluentValidation;
using MediatR;

namespace Cars.Application.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0290:Użyj konstruktora podstawowego", Justification = "<Oczekujące>")]
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
        
            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken)));
        
            var failures = validationResults
                .SelectMany(result => result.Errors)
                .Where(failure => failure is not null)
                .ToList();
        
            if (failures.Count != 0) throw new ValidationException(failures);
        }
    
        return await next(cancellationToken);
    }
}
