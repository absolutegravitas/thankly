type PostcodeRange = string | [string, string]

const metroPostcodeRanges: PostcodeRange[] = [
  ['1000', '1920'],
  ['2000', '2239'],
  ['2555', '2574'],
  ['2740', '2786'],
  ['3000', '3207'],
  ['3335', '3341'],
  ['3427', '3442'],
  ['3750', '3810'],
  ['3910', '3920'],
  ['3926', '3944'],
  ['3975', '3978'],
  ['3980', '3981'],
  ['5000', '5171'],
  ['5800', '5950'],
  ['6000', '6214'],
  ['6800', '6997'],
  ['8000', '8785'],
]

const regionalPostcodeRanges: PostcodeRange[] = [
  ['2250', '2483'],
  ['2500', '2551'],
  ['2575', '2594'],
  ['2621', '2647'],
  ['2649', '2714'],
  ['2716', '2730'],
  ['2787', '2880'],
  ['2648', '2715'],
  ['2717', '2731'],
  '2739',
  ['3211', '3334'],
  ['3342', '3424'],
  ['3444', '3749'],
  ['3812', '3909'],
  ['3921', '3925'],
  ['3945', '3971'],
  '3979',
  '3994',
  '3996',
  ['4371', '4372'],
  ['4382', '4390'],
  ['4406', '4498'],
  '4581',
  '4611',
  '4613',
  ['4620', '4723'],
  ['5201', '5734'],
  ['6215', '6646'],
  ['7000', '7254'],
  ['7258', '7323'],
]

const remotePostcodeRanges: PostcodeRange[] = [
  ['4724', '4870'],
  ['4872', '4873'],
  ['4877', '4888'],
  '4871',
  '4874',
  '4876',
  ['4890', '4895'],
  ['6701', '6770'],
  ['7255', '7257'],
  ['0800', '0821'],
  ['0828', '0834'],
  ['0870', '0871'],
  '0822',
  ['0835', '0862'],
  ['0872', '0875'],
  ['0880', '0881'],
  ['0885', '0909'],
]

function isInRange(postcode: string, ranges: PostcodeRange[]): boolean {
  return ranges.some((range) => {
    if (typeof range === 'string') {
      return postcode === range
    } else {
      const [start, end] = range
      return postcode >= start && postcode <= end
    }
  })
}

export function isMetroPostcode(postcode: string): boolean {
  return isInRange(postcode, metroPostcodeRanges)
}

export function isRegionalPostcode(postcode: string): boolean {
  return isInRange(postcode, regionalPostcodeRanges)
}

export function isRemotePostcode(postcode: string): boolean {
  return isInRange(postcode, remotePostcodeRanges)
}
